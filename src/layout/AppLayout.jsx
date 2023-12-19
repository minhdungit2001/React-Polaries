/* eslint-disable no-unused-vars */

import "./AppLayout.scss";
import {
  TopBar,
  Frame,
  AppProvider,
  Form,
  FormLayout,
  TextField,
  // Navigation
} from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import useConfirmModal from "../hooks/useConfirmModal";

function AppLayout({ children }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );

  const handleNavigationToggle = useCallback(() => {
    console.log("toggle navigation visibility");
  }, []);
  const logo = {
    topBarSource: "/assets/images/logo-avada.svg",
    width: 86,
    url: "#",
    accessibilityLabel: "Shopify",
  };

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{ content: "Back to Shopify", icon: ArrowLeftMinor }],
        },
        {
          items: [{ content: "Community forums" }],
        },
      ]}
      name="Dharma"
      detail="Jaded Pixel"
      initials="D"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={handleNavigationToggle}
    />
  );

  // const navigationMarkup = (
  //   <Navigation location="/">
  //     <Navigation.Section items={[]} />
  //   </Navigation>
  // );

  return (
    <AppProvider>
      <Frame
        topBar={topBarMarkup}
        logo={logo}
        // navigation={navigationMarkup}
      >
        {children}
      </Frame>
    </AppProvider>
  );
}

// function AppLayout() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState(false);
//   function onSubmit() {
//     console.log("onSubmit");
//   }

//   const handleChange = useCallback((value) => {
//     setValue(value);
//     setError(false);
//   }, []);

//   async function primaryActionModal() {
//     try {
//       if (!value.trim()) {
//         setError("You must enter your todo!");
//         return;
//       }
//       setError(false);
//       await onSubmit(value);
//       setValue("");
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const { modal, openModal, closeModal, open } = useConfirmModal({
//     confirmAction: primaryActionModal,
//     cancelAction: () => {},
//     title: "Create new todo",
//     content: (
//       <FormLayout>
//         <TextField
//           value={value}
//           onChange={handleChange}
//           label="Todo"
//           type="text"
//           autoComplete="off"
//           placeholder="Type todo..."
//           error={error}
//         />
//       </FormLayout>
//     ),
//     buttonTitle: "Create",
//     closeTitle: "Cancel",
//     loading: false,
//     disabled: false,
//     destructive: false,
//     closeCallback: () => {},
//     canCloseAfterFinished: true,
//     successCallback: () => {},
//     sectioned: true,
//     large: false,
//     isConfirmButton: true,
//     disabledSecondBtn: false,
//     loadingSecondBtn: false,
//     titleHidden: false,
//     secondaryActions: [
//       {
//         content: "Custom Cancel",
//         loading: false,
//         onAction: () => {},
//         disabled: false,
//       },
//     ],
//   });

//   return (
//     <AppProvider>
//       <button onClick={() => openModal(123)}>Open Confirm Modal</button>

//       {modal}

//       <div>{open ? "Modal is open" : "Modal is closed"}</div>
//     </AppProvider>
//   );
// }
export default AppLayout;
