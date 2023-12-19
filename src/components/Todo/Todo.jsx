import { useState, useCallback } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import useConfirmModal from "../../hooks/useConfirmModal";
import {
  Card,
  Page,
  Button,
  ResourceList,
  ResourceItem,
  EmptyState,
  FormLayout,
  TextField,
  InlineStack,
  Text,
  Badge,
  ButtonGroup,
} from "@shopify/polaris";

function Todo() {
  const {
    data: todos,
    loading,
    setLoading,
    refetch,
    api,
  } = useFetchApi({ url: "/todos", presentDataFunc: (data) => data.data });
  const [selectedItems, setSelectedItems] = useState([]);

  async function fetchTodos() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    refetch();
  }

  async function handleCreateTodo(value) {
    try {
      setLoading(true);

      const resp = await api({
        url: "/todos",
        method: "POST",
        postData: { text: value },
      });
      if (resp.success) {
        await fetchTodos();
        return true;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteTodos(ids, newValue) {
    try {
      setLoading(true);

      const resp = await api({
        url: `/todos`,
        method: "PUT",
        postData: { ids: ids, data: { isCompleted: newValue } },
      });
      if (resp.success) {
        await fetchTodos();
        setSelectedItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTodos(ids) {
    try {
      setLoading(true);

      const resp = await api({
        url: `/todos`,
        method: "DELETE",
        postData: { ids: ids },
      });

      if (resp.success) {
        await fetchTodos();
        setSelectedItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const promotedBulkActions = [
    {
      content: "Complete",
      onAction: () => handleCompleteTodos(selectedItems, true),
    },
    {
      content: "Delete",
      onAction: () => handleDeleteTodos(selectedItems),
    },
  ];

  const bulkActions = [];
  const resourceName = {
    singular: "todo",
    plural: "todos",
  };

  const handleSelected = (selected) => {
    setSelectedItems(selected);
  };

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChangeNewTodo = useCallback((value) => {
    setValue(value);
    setError(false);
  }, []);

  async function confirmActionModal() {
    try {
      if (!value.trim()) {
        setError("You must enter your todo!");
        return;
      }
      const success = await handleCreateTodo(value);

      if (!success) {
        return false;
      }
      setValue("");
      setError(false);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  const { modal, openModal } = useConfirmModal({
    confirmAction: confirmActionModal,
    cancelAction: () => {},
    title: "Create new todo",
    content: (
      <FormLayout>
        <TextField
          value={value}
          onChange={handleChangeNewTodo}
          label="Todo"
          type="text"
          autoComplete="off"
          placeholder="Type todo..."
          error={error}
        />
      </FormLayout>
    ),
    buttonTitle: "Create",
    closeTitle: "Cancel",
    loading: loading,
    disabled: false,
    destructive: false,
    closeCallback: () => {},
    canCloseAfterFinished: true,
    successCallback: () => {},
    sectioned: true,
    large: false,
    isConfirmButton: true,
    disabledSecondBtn: false,
    loadingSecondBtn: false,
    titleHidden: false,
    secondaryActions: [
      {
        content: "Custom Cancel",
        loading: false,
        onAction: () => {},
        disabled: false,
      },
    ],
  });

  return (
    <Page
      title="Todoes"
      primaryAction={
        <Button variant="primary" onClick={() => openModal(1)}>
          Create todo
        </Button>
      }
    >
      {modal}

      <Card padding="0">
        <ResourceList
          resourceName={resourceName}
          items={todos}
          selectedItems={selectedItems}
          onSelectionChange={handleSelected}
          promotedBulkActions={promotedBulkActions}
          bulkActions={bulkActions}
          loading={loading}
          emptyState={
            <EmptyState
              heading="Relax..."
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>You have nothing to do!</p>
            </EmptyState>
          }
          renderItem={(item) => (
            <ResourceItem
              id={item.id}
              text={item.text}
              isCompleted={item.isCompleted}
            >
              <InlineStack blockAlign="center" align="space-between">
                <Text as="h2" variant="bodyMd">
                  {item.text}
                </Text>
                <InlineStack gap="400">
                  {item.isCompleted ? (
                    <Badge tone="success">Done</Badge>
                  ) : (
                    <Badge tone="attention">Pending</Badge>
                  )}
                  <ButtonGroup>
                    <Button
                      onClick={() =>
                        handleCompleteTodos([item.id], !item.isCompleted)
                      }
                    >
                      {item.isCompleted ? "Uncompleted" : "Completed"}
                    </Button>
                    <Button
                      variant="primary"
                      tone="critical"
                      onClick={() => handleDeleteTodos([item.id])}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </InlineStack>
              </InlineStack>
            </ResourceItem>
          )}
        />
      </Card>
    </Page>
  );
}

export default Todo;
