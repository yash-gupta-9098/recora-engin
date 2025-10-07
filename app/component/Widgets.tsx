
import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Link,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";

import { EditIcon } from "@shopify/polaris-icons"; 
import { useState } from "react";

const items = [
  {
  title: "Home Page",
  subText: "Shows the Newly added products from store",
  handle : "home",
}, 
{
  title: "Product Page",
  subText: "Display the related products based on various conditions like same collection, tags, vendor & type",  
  handle: "product"
}, 
{
  title: "Cart Page",
  subText: "Shows the relevant products inspired by users browsing history",
  handle: "cart"
},  
{
  title: "Collection Pages",
  subText: "Shows the recently viewed products which were browsed by visitor",
  handle:   "collection"
}, 
{
  title: "Search Results Page",
  subText: "Shows products which were sold most number of times or the best sellers by A.I.",
  handle:  "search"
}, 
{
  title: "404 Not Found Page",
  subText: "You can assign products to a collection and select that here to show Featured Products",
  handle:   "notFound"
},
{
  title: "Blog Posts or Other Pages",
  subText: "You can assign products to a collection and select that here to show Featured Products",
  handle:   "other"
}
] 




interface WidgetProps {
  heading?: string;
} 


export default function Widgets({heading}: WidgetProps){
const [loadingHandle, setLoadingHandle] = useState<string | null>(null);
// const [loadingHandle, setLoadingHandle]

 if (items && items.length < 1 ) {
    return (
      <BlockStack gap="400" align="center">
        <Spinner size="large" accessibilityLabel="Loading widgets" />        
      </BlockStack>
    );
  }


   const handleClick = (handle: string) => {
    setLoadingHandle(handle); // only this button is loading   
  };

  
return(

<BlockStack gap={"400"}>

    {heading  && ( <Text as="h4" variant="headingLg">{heading}</Text>)}


    <InlineGrid gap="400" columns={3}>
        {items.map((item) => (
         
        <InlineStack key={item.title}>
            <div className="rec-card  Polaris-ShadowBevel" style={{display:"flex", flexDirection:"column",  height:"100%" , width:"100%" , padding:"1rem" ,  gap:"10px" , }}>
              <Text as="h2" variant="headingSm">
                {item.title}
              </Text>
              <Divider borderColor="border"/>
              <Text as="h3" variant="headingSm" fontWeight="medium">
                {item.subText}
              </Text>

              {/* This spacer pushes the button to the bottom */}
              <div style={{ flexGrow: 1 }} />

              {/* Align button to the bottom-right */}
              <InlineStack align="end">
                {/* <Link to="new-arrivals"/> */}
                <Button    
                  url={`/app/features/${item.handle}`}        
                  variant="secondary"
                  icon={EditIcon}                  // loading={loading}
                  loading={loadingHandle === item.handle}
                  onClick={() => {handleClick(item.handle)}}
                >
                  Setup
                </Button>
                {/* </Link> */}
              </InlineStack>
            </div>
        </InlineStack>
        ))}
      </InlineGrid>
      </BlockStack>
      
)

}