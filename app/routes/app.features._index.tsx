import { useAppBridge } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import Widgets from "app/component/Widgets";
import { useEffect } from "react";

export default function Index() {

const shopify = useAppBridge();




  return (
    <Page>
      <Widgets />
    </Page>
  );
} 