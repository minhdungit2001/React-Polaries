import { useState, useCallback } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import useConfirmModal from "../../hooks/useConfirmModal";
import {
  Card,
  Page,
  Button,
  ResourceList,
  ResourceItem,
  FormLayout,
  TextField,
  InlineStack,
  Text,
  Badge,
  ButtonGroup,
} from "@shopify/polaris";
import AppEmptyState from "../EmptyState/AppEmptyState";

function Todo() {
  const {
    data: todos,
    loading,
    api,
  } = useFetchApi({ url: "/todos", presentDataFunc: (data) => data.data });
  const [selectedItems, setSelectedItems] = useState([]);

  async function handleCreateTodo(value) {
    try {
      closeModal();
      const resp = await api({
        url: "/todos",
        method: "POST",
        postData: { text: value },
      });
      if (resp.success) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCompleteTodos(ids, newValue) {
    try {
      const resp = await api({
        url: `/todos`,
        method: "PUT",
        postData: { ids: ids, data: { isCompleted: newValue } },
      });

      if (resp.success) {
        ids.length !== 1 ? setSelectedItems([]) : null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTodos(ids) {
    try {
      const resp = await api({
        url: `/todos`,
        method: "DELETE",
        postData: { ids: ids },
      });

      if (resp.success) {
        setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function primaryAction() {
    setValue(() => "");
    setError(() => "");
    openModal();
  }

  // const disableCompleteAll = (() => {
  //   let result = true;

  //   selectedItems.forEach((id) => {
  //     const currenTodo = todos.find((todo) => todo.id === id);
  //     if (!currenTodo.isCompleted) {
  //       result = false;
  //       return;
  //     }
  //   });

  //   return result;
  // })();
  const promotedBulkActions = [
    {
      content: "Complete",
      // disabled: disableCompleteAll,
      onAction: () => handleCompleteTodos(selectedItems, true),
    },
    {
      content: "Delete",
      onAction: () => handleDeleteTodos(selectedItems),
    },
  ];

  const resourceName = {
    singular: "todo",
    plural: "todos",
  };

  const handleSelected = (selected) => {
    setSelectedItems(() => selected);
  };

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChangeNewTodo = useCallback((value) => {
    setValue(() => value);
    setError(() => "");
  }, []);

  async function confirmActionModal() {
    try {
      if (!value.trim()) {
        setError(() => "You must enter your todo!");
        return;
      }
      const success = await handleCreateTodo(value);

      if (!success) {
        return false;
      }
      setValue(() => "");
      setError(() => "");
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  const { modal, openModal, closeModal } = useConfirmModal({
    confirmAction: confirmActionModal,
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
    closeCallback: () => {
      setError(() => "");
    },
  });

  return (
    <Page
      title="Todoes"
      primaryAction={
        <Button variant="primary" onClick={primaryAction}>
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
          bulkActions={[]}
          loading={loading}
          emptyState={<AppEmptyState />}
          renderItem={(item) => (
            <ResourceItem
              key={item.id + item.isCompleted}
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
