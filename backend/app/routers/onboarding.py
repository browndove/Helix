from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Submission, SubmissionStatus
from app.schemas import SubmissionCreate, SubmissionOut, SubmissionPayload, SubmissionUpdate
from app.services.files import delete_submission_file, save_submission_file
from app.services.submissions import (
    apply_payload,
    submission_to_out,
    submit_submission,
    uploads_meta_to_dict,
)

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


def _get_submission_or_404(db: Session, submission_id: UUID) -> Submission:
    submission = db.get(Submission, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission


@router.post("/submissions", response_model=SubmissionOut, status_code=201)
def create_submission(body: SubmissionCreate, db: Session = Depends(get_db)):
    submission = Submission(status=SubmissionStatus.incomplete.value)
    apply_payload(submission, body)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission_to_out(submission)


@router.get("/submissions/{submission_id}", response_model=SubmissionOut)
def get_submission(submission_id: UUID, db: Session = Depends(get_db)):
    return submission_to_out(_get_submission_or_404(db, submission_id))


@router.patch("/submissions/{submission_id}", response_model=SubmissionOut)
def update_submission(
    submission_id: UUID,
    body: SubmissionUpdate,
    db: Session = Depends(get_db),
):
    submission = _get_submission_or_404(db, submission_id)
    if body.portal_phase is not None:
        submission.portal_phase = body.portal_phase
    if body.answers is not None:
        submission.answers = body.answers
    if body.uploads is not None:
        submission.uploads_meta = uploads_meta_to_dict(body.uploads)
    if body.submitted is not None:
        submission.submitted = body.submitted
    from app.services.submissions import sync_denormalized

    sync_denormalized(submission)
    db.commit()
    db.refresh(submission)
    return submission_to_out(submission)


@router.put("/submissions/{submission_id}", response_model=SubmissionOut)
def replace_submission(
    submission_id: UUID,
    body: SubmissionCreate,
    db: Session = Depends(get_db),
):
    submission = _get_submission_or_404(db, submission_id)
    apply_payload(submission, body)
    db.commit()
    db.refresh(submission)
    return submission_to_out(submission)


@router.post("/submissions/{submission_id}/submit", response_model=SubmissionOut)
def submit(submission_id: UUID, db: Session = Depends(get_db)):
    submission = _get_submission_or_404(db, submission_id)
    submit_submission(db, submission)
    db.commit()
    db.refresh(submission)
    return submission_to_out(submission)


@router.get("/submissions/by-email/{email}", response_model=SubmissionOut)
def lookup_draft(email: str, db: Session = Depends(get_db)):
    normalized = email.strip().lower()
    submission = db.execute(
        select(Submission)
        .where(
            Submission.facility_email == normalized,
            Submission.submitted.is_(False),
        )
        .order_by(Submission.updated_at.desc())
        .limit(1)
    ).scalars().first()
    if not submission:
        raise HTTPException(status_code=404, detail="No draft found for this email")
    return submission_to_out(submission)


@router.post("/submissions/{submission_id}/files/{upload_key}", response_model=SubmissionOut)
async def upload_file(
    submission_id: UUID,
    upload_key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    submission = _get_submission_or_404(db, submission_id)
    await save_submission_file(db, submission, upload_key, file)
    db.refresh(submission)
    return submission_to_out(submission)


@router.delete("/submissions/{submission_id}/files/{upload_key}", response_model=SubmissionOut)
def remove_file(submission_id: UUID, upload_key: str, db: Session = Depends(get_db)):
    submission = _get_submission_or_404(db, submission_id)
    delete_submission_file(db, submission, upload_key)
    db.refresh(submission)
    return submission_to_out(submission)


@router.post("/submissions/import", response_model=SubmissionOut, status_code=201)
def import_payload(body: SubmissionPayload, db: Session = Depends(get_db)):
    """Accept full portal JSON (submit or export) in one request."""
    submission = Submission()
    apply_payload(submission, body)
    if body.submitted:
        submit_submission(db, submission)
    else:
        submission.status = SubmissionStatus.incomplete.value
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission_to_out(submission)
