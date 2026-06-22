import { AlertCircle } from "lucide-react";
import Card from "./ui/Card";
import Text from "./ui/Text";
import { formatSyncTime, LAST_SYNCED } from "../data/mockData";

export default function FreshnessBanner() {
  return (
    <Card hover={false} padding="px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-accent-orange" />
        <Text as="p" variant="body-sm" color="text-secondary">
          Store data is delayed 24–48 hours. Last synced:{" "}
          <Text as="span" variant="body-sm-semibold" color="text-primary">
            {formatSyncTime(LAST_SYNCED)}
          </Text>
          . For real-time installs, connect AppsFlyer or Adjust SDK.
        </Text>
      </div>
    </Card>
  );
}
