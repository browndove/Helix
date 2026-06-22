import Text from "./ui/Text";

export default function TitleBar({ title }) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-tertiary bg-primary px-6 shadow-input">
      <Text as="h1" variant="heading-sm" color="text-primary">
        {title}
      </Text>
    </header>
  );
}
