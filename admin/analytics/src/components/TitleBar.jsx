import Text from "./ui/Text";

export default function TitleBar({ title }) {
  return (
    <header className="glass-toolbar flex h-12 shrink-0 items-center px-6">
      <Text as="h1" variant="heading-sm" color="text-primary">
        {title}
      </Text>
    </header>
  );
}
