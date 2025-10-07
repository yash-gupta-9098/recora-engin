import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Banner,
  Collapsible,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { LockIcon } from "@shopify/polaris-icons";
import Widgets from "app/component/Widgets";
// import Widgets from "../app/component/widgets";

export const loader = async ({ request }: LoaderFunctionArgs)=> {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs)=> {
  const { admin } = await authenticate.admin(request);


  return {};
};

export default function Index() {

  const shopify = useAppBridge();



useEffect(()=>{

  shopify.loading(true);

  shopify.loading(false);
})


  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [passwordToggle, setPasswordToggle] = useState(false);

  const handlepasswordToggle = useCallback(
    () : any=> setPasswordToggle((prev: boolean) : any=> !prev),
    [],
  );

  const handlePasswordChange = useCallback((newValue: string): void=> {
    setError(false);
    setPassword(newValue);
  }, []);

  const handlePasswordSubmit = ()=> {
    if (password.length == 0) {
      setError(true);
      return;
    }

    setPasswordToggle((prev: boolean) : any=> !prev);
  };



  return(
    <Page>
      <TitleBar title="Recora Similer Product App"></TitleBar>

      <BlockStack gap="500">
        {/* WElcom Message */}
        <BlockStack>
          <Text as="h4" variant="headingXl">
            {" "}
            Hello , There{" "}
          </Text>
          <Text variant="bodyMd" as="p">
            Welcome to <b>Recora Product Recomndation </b>, handcrafted by
            RecoraApps
          </Text>
        </BlockStack>

        {/* partners message */}
        <Banner title="Howdy partners!" onDismiss={() : void => console.log("close")} >
          <p>
            We're glad you're using our app for your client store. If you
            require any assistance with the customization or have anything to
            say to us, write back to us and we'll be more than happy to listen
            and serve you with an appropriate solution right away. Not to
            mention, we offer priority support for partners.
          </p>
        </Banner>

        {/* Password Banner  */}
        <Banner
          icon={LockIcon}
          title="Your online store is password protected"
          tone="warning"
          onDismiss={() => {
            console.log("test");
          }}
        >
          <BlockStack gap={"200"}>
            <p>
              Please share your online store password so our team can access
              your store and support you better.
            </p>
            <InlineStack>
              <Button
                disabled={passwordToggle}
                onClick={handlepasswordToggle}
                ariaExpanded={passwordToggle}
                ariaControls="password-collapsible"
              >
                Add Password
              </Button>
            </InlineStack>
            <Collapsible
              open={passwordToggle}
              id="password-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <TextField
               label=""
                type="text"
                max={"100"}
                helpText={
                  !error ? `${password.length} of 100 characters used` : ""
                }
                error={error ? "Password can't be blank" : ""}
                value={password}
                onChange={handlePasswordChange}
                autoComplete="off"
                connectedRight={
                  <Button onClick={handlePasswordSubmit} >Submit</Button>
                }
              />
            </Collapsible>
          </BlockStack>
        </Banner>

        {/* setps  */}




        {/* widgets */}

        <Widgets heading="Features"/>


      </BlockStack>
    </Page>
  );
}
