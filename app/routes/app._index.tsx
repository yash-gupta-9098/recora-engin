import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import StepIcon from "app/utils/SvgIcons/StepIcon";
import StepIconChecked from "app/utils/SvgIcons/StepIconChecked";
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
  InlineGrid,
  Divider,
  ProgressBar,
  Icon,
} from "@shopify/polaris";
import {Modal ,  TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, LockIcon } from "@shopify/polaris-icons";
import Widgets from "app/component/Widgets";
// import Widgets from "../app/component/widgets";

export const loader = async ({ request }: LoaderFunctionArgs)=> {
 const { admin } = await authenticate.admin(request);
  // const response = await admin.graphql(`#graphql
  // query {
  //   themes(first: 10) {
  //       nodes {
  //         name
  //         id
  //         role
  //         updatedAt
  //       }}}`);

  // const parsedResponse = await response.json();

  // console.log(parsedResponse,'Fetched Themes:');
  // const { themes} = parsedResponse.data;

  // //  console.log(themes.nodes,'Fetched Themes last data:');
  
  // return {themes : themes.nodes}
  return null;
  
};

export const action = async ({ request }: ActionFunctionArgs)=> {
  const { admin } = await authenticate.admin(request);


  return {};
};

export default function Index() {

  const shopify = useAppBridge();










  // const { themes } = useLoaderData();

   const [stepCollaps, setStepCollaps] = useState(true);
   const [openIndex, setOpenIndex] = useState(0);
  const [openCollabes, setOpenCollabes] = useState(0);
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


  const collapsibles = [
    {
      title: "Enable wishlist on theme",
      subTitle: "Deploy your fully configured wishlist to your active storefront. ",
      image: "https://procdn.swymrelay.com/embed/assets/Step1.svg",
      buttonTitle: "Proceed with setup",
      onClick:() => {
        
      }
    },
    {
      title: "Set up Recora theme",
      subTitle: "Complete set up via the theme editor and publish your store ",
      image: "https://procdn.swymrelay.com/embed/assets/Step1.svg",
      buttonTitle: "Customize theme",
      onClick:() => shopify.modal.show('my-settings-modal')
    },
    {
      title: "Set up Recora features",
      subTitle: "View analytics on your Wishlist dashboard to gauge performance ",
      image: "https://procdn.swymrelay.com/embed/assets/Step3.svg",
      buttonTitle: "Explore features",
      onClick:() => shopify.modal.show('my-features-modal')
    },
  ];




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
          <Card padding={"0"}>
                        
                          <Box paddingInline={"600"} paddingBlock={"600"}> 
                          <BlockStack>
                              <InlineStack align="space-between" gap="200" blockAlign="center">
                                <Text as="h3" variant="headingMd">
                                  Get started
                                </Text>
                                <Button icon={   stepCollaps  ? ChevronUpIcon : ChevronDownIcon} variant="tertiary" onClick={() => {
                                  setStepCollaps(!stepCollaps);
                                }}
                                ariaExpanded={stepCollaps}
                                ariaControls="step-collapsible"                            
                                ></Button>
                                </InlineStack>
                                <Text as="p" variant="bodyMd">Follow these steps to set up the app and start recommending products to your customers.</Text>
                                <Box paddingBlockStart={"100"} as="div">
                                  <InlineStack  gap="200" blockAlign="center">
                                    <Text as="p" variant="bodyMd">1 of 3 tasks completed</Text>
                                    <div style={{width: 225}}>
                                      <ProgressBar progress={34} size="small" tone="success" />
                                    </div>
                                    </InlineStack>
                                </Box>
                            </BlockStack>
                          </Box>
                          {stepCollaps && (<Divider /> )}
                            
                            <Collapsible
                              open={stepCollaps}
                              id="step-collapsible"
                              transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                              expandOnPrint
                            >
                              <Box paddingInline={"600"} paddingBlock={"600"}> 
                              <BlockStack gap="400">
                                {collapsibles.map((collapsible, index) => (
                                  // <Card key={index} roundedAbove="sm">
                                    <div
                                      key={index} style={{ padding: "20px", cursor: "pointer", border: "1px dashed #E1E3E6" , borderRadius:"8px", backgroundColor: (openIndex === index || openCollabes === index) ? "#F9FAFB" : "white" }}
                                      onMouseEnter={() => setOpenIndex(index)} onMouseLeave={() => {
                                        console.log("levae")
                                        setOpenIndex(openCollabes)
                                      }} onClick={() => {
                                        console.log("click")
                                        setOpenCollabes(index)
                                      }}
                                    >
                                      <InlineGrid columns={["twoThirds", "oneThird"]}>
                                        <InlineStack gap="300" wrap={false}>
                                       {(openIndex === index || openCollabes === index) ? <StepIcon /> :  <StepIconChecked /> }
                                          <BlockStack gap="100">                                          
                                            <Text
                                              as="h4"
                                              variant="bodyMd"
                                              fontWeight="semibold"
                                            >
                                              {collapsible.title}
                                            </Text>
                                            <Text as="p" variant="bodyMd">{collapsible.subTitle}</Text>
                                            <Collapsible
                                              open={(openIndex === index || openCollabes === index)}
                                              id={`basic-collapsible${index}`}
                                              transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                              expandOnPrint
                                            >

                                              <Box paddingBlockStart={"300"}>
                                                <Button variant="primary" onClick={collapsible.onClick}>{collapsible.buttonTitle}</Button>
                                              </Box>
                                            </Collapsible>


                                          </BlockStack>
                                        </InlineStack>
                                        <Collapsible
                                          open={(openIndex === index || openCollabes === index)}
                                          id="basic-collapsible"
                                          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                          expandOnPrint
                                        >
                                          <InlineStack align="end">
                                            <img
                                              alt=""
                                              width="140px"
                                              height="auto"
                                              style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                              }}
                                              src={collapsible.image}
                                            />
                                          </InlineStack>
                                        </Collapsible>
                                      </InlineGrid>

                                    </div>
                                  /* </Card> */
                                ))}
                              </BlockStack>
                              </Box>
                              </Collapsible>
                        
          </Card>

        {/* widgets */}

        <Widgets heading="Features"/>


      </BlockStack>
       <Modal id="my-settings-modal" src="/app/settings" variant="max">
        <TitleBar title="Title">
          <button variant="primary">Label</button>
          <button onClick={() => shopify.modal.hide('my-settings-modal')}>Label</button>
        </TitleBar>
      </Modal> 


     <Modal id="my-features-modal" src="/app/features" variant="max">
        <TitleBar title="Title">
          <button variant="primary">Label</button>
          <button onClick={() => shopify.modal.hide('my-features-modal')}>Label</button>
        </TitleBar>
      </Modal> 




     
    </Page>
  );
}
