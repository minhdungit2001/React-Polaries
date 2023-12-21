import { Text, EmptyState } from "@shopify/polaris";

export default function AppEmptyState({
  header = "Relax...",
  text = "You have nothing to do!",
}) {
  return (
    <EmptyState
      heading={header}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <Text>{text}</Text>
    </EmptyState>
  );
}
