/**
 * Optimized Settings Page with Static Data
 * TypeScript implementation with theme management
 */
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Divider,
  Tooltip,
  Tabs,
} from "@shopify/polaris";
import {
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import { Form, useLoaderData } from "@remix-run/react";
import TabsLayout from "app/component/recoracomponent/settings/Tabs/TabsLayout";
import TabsProductCard from "app/component/recoracomponent/settings/Tabs/TabsProductCard";
import TabsColor from "app/component/recoracomponent/settings/Tabs/TabsColor";
import { authenticate } from "../shopify.server";
import { getShopSettings } from "db/getShopSettings";
import { updateShopSettings } from "db/updateShopSettings";
import { Modal, SaveBar, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import RecoraDiv from "app/component/recoracomponent/RecoraDiv";
import DesktopPreview from "app/component/recoracomponent/PreviewRight/DesktopPreview";
import Mobile from "app/component/recoracomponent/PreviewRight/Mobile";
import Tablet from "app/component/recoracomponent/PreviewRight/Tablet";

// TypeScript interfaces for better type safety
interface ColorSchemeData {
  [key: string]: {
    text: string;
    text_Secondary: string;
    background: string;
    border: string;
  };
}

interface LayoutSettings {
  layoutValue: string;
  totalProduct: number;
  desktop: {
    viewType: string;
    rangeProValue: number;
  };
  tablet: {
    viewType: string;
    rangeProValue: number;
  };
  mobile: {
    viewType: string;
    rangeProValue: number;
  };
}

interface ProductTitleSettings {
  showTitle: boolean;
  titleClip: boolean;
  color: string;
  fontSize: number;
}

interface ProductPriceSettings {
  showPrice: boolean;
  color: string;
  fontSize: number;
  comparePrice: {
    showComparePrice: boolean;
    color: string;
    fontSize:number;
  };
  showZeroToFree: boolean;
}

interface ProductImageSettings {
  ratio: string;
  onHover: boolean;
  showVariantImage: boolean;
  cropImage: boolean;
  cropType: string;
  padding: number;
}

interface ProductCardSettings {
  cardStyle: string;
  reviewType: string;
  wishlist: string;
  colorScheme: string;
  showVendor: boolean;
  textAlignType: string;
}

interface SettingsPayload {
  commanView: LayoutSettings;
  productTitle: ProductTitleSettings;
  productPrice: ProductPriceSettings;
  productImage: ProductImageSettings;
  productCard: ProductCardSettings;
  customCSS: string;
  colorScheme: ColorSchemeData;
}

type LoaderData = {
  developerMode: boolean;
  products: any[];
  settings: Record<string, any>;
};


// tab Code
const tabs = [
  {
    id: "repeat-customers-4",
    content: "Color",
    panelID: "repeat-customers-content-4",
  },
  {
    id: "accepts-marketing-4",
    content: "Product Card",
    accessibilityLabel: "Layout",
    panelID: "accepts-marketing-content-4",
  },
  {
    id: "all-customers-4",
    content: "Layout",
    accessibilityLabel: "Layout",
    panelID: "all-customers-content-4",
  },
];



export const query = `
query Products($first: Int) {
     products(first: $first) {
    edges {
      node {
        id
        title
        vendor
        status
        variants(first: 5) {
          nodes {
            price
            displayName
            contextualPricing(context: {}) {
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
            }
            image {
              url(transform: {crop: CENTER})
            }
          }
        }
        media(first: 2) {
          nodes {
            preview {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}
`;

// Static action handler for form submission
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const payload = formData.get("payload") as string;

  const globalSetting = {
    globalSettings: JSON.parse(payload),
  };
  const updateSettings = await updateShopSettings(request, globalSetting);

  // For now, just return success
  return { success: true };
};

// Static loader that returns static data
export const loader = async ({ request }: { request: Request }) => {

  const { session , admin } = await authenticate.admin(request);
  const defaultSettings = await getShopSettings(session.shop);
    const url = new URL(request.url);
  const isDeveloper = url.searchParams.get("r3c0r@") === "true";

   const response = await admin.graphql(query, { variables: { first: 10 } });
  const products = await response.json();


  return {
    developerMode:isDeveloper,
    products: products.data.products.edges,
    settings: { value: { payload: JSON.stringify(defaultSettings) } },
  };
};





export default function AdditionalPage() {

const shopify = useAppBridge();

useEffect(()=>{
  shopify.loading(true);
  shopify.loading(false);
})

const handleSave = () => {
    document.querySelector("form")?.requestSubmit();
    shopify.toast.show('Seetings Save');
    shopify.saveBar.hide('global-settings');
  };

  const handleDiscard = () => {
    console.log('Discarding');
    // shopify.toast.show('Seetings Discard');
    shopify.saveBar.hide('global-settings');
    
  };
  
  // tab Variables
  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  }, []);

  const { developerMode , products, settings } = useLoaderData<LoaderData>();


 

  const settingfromDb = JSON.parse(settings.value.payload) ;

  // const {shop , settingsData} = settings.value

  type Action =
    // | {
    //     type: "UPDATE_FONT_SIZE";
    //     section: "productTitle" | "productPrice";
    //     payload: number;
    //   }
    // | 
    {
        type: "UPDATE_COLOR_SCHEME";
        schemeName: string;
        payload: {
          text: string;
          text_Secondary: string;
          background: string;
          border: string;
        };
      }
    | {
        type: "UPDATE_PRODUCT_IMAGE";
        payload: {
          customClass: string;
          ratio: string;
          onHover: boolean;
          showVariantImage: boolean;
          cropImage: boolean;
          cropType: "top" | "center" | "bottom";
          padding: number;
        };
      }
    | {
        type: "UPDATE_COMMANVIEW";
        payload: {
          customClass:string;
          layoutValue: string;
          totalProduct: number;
          heading:{
            fontSize:number;
            color:string;
            textAlign:string;
            customClass:string;
          },
          subHeading:{
            customClass:string;
            fontSize:number;
            color:string;
            textAlign:string;
          },
          desktop: {
            rangeProValue: number;
            viewType: string;
            screenSize:string;
          };
          mobile: {
            rangeProValue: number;
            viewType: string;
            screenSize:string;
          };
          tablet: {
            rangeProValue: number;
            viewType: string;
            screenSize:string;
          };
        };
      }
    | {
        type: "UPDATE_PRODUCT_TITLE";
        payload: {
          showTitle: boolean;
          titleClip: boolean;
          color: string;
          fontSize: number;
          customClass: string;
        };
      }
    | {
        type: "UPDATE_PRODUCT_PRICE";
        payload: {
          showPrice: boolean;
          color: string;
          fontSize: number;
          customClass: string;
          comparePrice: {
            fontSize:number;
            showComparePrice: boolean;
            color: string;
          };
          variantPrice:{
            fontSize:number;
            showVariantPrice: boolean;
            color: string;
          };
          singlePriceColor:string;
          showZeroToFree: boolean;
        };
      }
    | {
        type: "UPDATE_PRODUCT_CARD";
        payload: {
          customClass: string;
          cardStyle: string;
          reviewType: string;
          wishlist: string;
          colorScheme: string;
          showVendor: boolean;
          textAlignType: string;
        };
      };

  function reducer(
    state: typeof settingfromDb,
    action: Action,
  ): typeof settingfromDb {
    switch (action.type) {
      case "UPDATE_COMMANVIEW":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            commanView: {
              ...state.globalSettings.commanView,
              ...action.payload,
              heading:{
              ...state.globalSettings.commanView.heading,
                ...action.payload.heading,
              },
              subHeading:{
                ...state.globalSettings.commanView.subHeading,
                ...action.payload.subHeading,
              },
              desktop: {
                ...state.globalSettings.commanView.desktop,
                ...action.payload.desktop,
              },
              mobile: {
                ...state.globalSettings.commanView.mobile,
                ...action.payload.mobile,
              },
              tablet: {
                ...state.globalSettings.commanView.tablet,
                ...action.payload.tablet,
              },
            },
          },
        };  
      case "UPDATE_COLOR_SCHEME":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            colorScheme: {
              ...state.globalSettings.colorScheme,
              [action.schemeName]: {
                ...state.globalSettings.colorScheme[action.schemeName],
                ...action.payload,
              },
            },
          },
        };

      case "UPDATE_PRODUCT_IMAGE":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            productImage: {
              ...state.globalSettings.productImage,
              ...action.payload,
            },
          },
        };
      case "UPDATE_PRODUCT_TITLE":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            productTitle: {
              ...state.globalSettings.productTitle,
              ...action.payload,
            },
          },
        };
      case "UPDATE_PRODUCT_PRICE":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            productPrice: {
              ...state.globalSettings.productPrice,
              ...action.payload,
              comparePrice: {
                ...state.globalSettings.productPrice.comparePrice,
                ...action.payload.comparePrice,
              },
              variantPrice:{
                ...state.globalSettings.productPrice.variantPrice,
                ...action.payload.variantPrice,
              }
            },
          },
        };
      case "UPDATE_PRODUCT_CARD":
        return {
          ...state,
          globalSettings: {
            ...state.globalSettings,
            productCard: {
              ...state.globalSettings.productCard,
              ...action.payload,
            },
          },
        };
      default:
        return state;
    }
  }

  const [finalsettings, dispatch] = useReducer(reducer, settingfromDb);


  const customDispatch = (action: Action) => {
  dispatch(action);
  shopify.saveBar.show('global-settings')

};


  const renderTabContent = () => {
    switch (selected) {
      case 0:
        return (
          <TabsColor
            settingfromDb={finalsettings.globalSettings}
            dispatch={customDispatch}
          />
        );
      case 1:
        return (
          <TabsProductCard
            settingfromDb={finalsettings.globalSettings}
            dispatch={customDispatch}
            developerMode={developerMode}
          />
        );
      case 2:
        return (
          <TabsLayout
            settingfromDb={finalsettings.globalSettings}
            dispatch={customDispatch}
            developerMode={developerMode}
          />
        );
      default:
        return null;
    }
  };

  // const [open, setOpen] = useState(false);

  // collapasble
  // const [openSection, setOpenSection] = useState(null);

  // const handleToggle = (section) => {
  //   setOpenSection(openSection === section ? null : section);
  // };

  // // preview  tabs

  const [previewStyle, setPreviewStyle] = useState("desktop");
  const [disableDesktop, setDisableDesktop] = useState(false);
  const [disableTablet, setDisableTablet] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      
      if(window.innerWidth >= 768){
        setDisableDesktop(false)
    setDisableTablet(false)
      setPreviewStyle("desktop")
    }
      else if(window.innerWidth < 768 && window.innerWidth > 549){
        setDisableDesktop(true)
      setPreviewStyle("tablet")
    }
  else{
    setDisableDesktop(true)
    setDisableTablet(true)
      setPreviewStyle("mobile")
  }
  };
  
    handleResize(); // initial check on mount
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // preview  tabs

  const handlePreviewStyle = useCallback((value: string) => {
    setPreviewStyle(value);
  }, []);

  return (
    <Form method="post">
      <RecoraDiv style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <Page
          fullWidth={true}
          title="Settings"          
        >
          <Modal id="my-modal" src="/app/preview" variant="large">
        <p>Message</p>
        <TitleBar title="Title">
          <button variant="primary">Label</button>
          <button onClick={() => shopify.modal.hide('my-modal')}>Label</button>
        </TitleBar>
      </Modal>
          <SaveBar
          id="global-settings"          
           >
          <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleDiscard}></button>
        </SaveBar>
          <Layout sectioned={false}>
            <Layout.Section>
              <Card background="bg-surface" padding="0" roundedAbove="sm">
                <Box
                  as="div"
                  borderStyle="solid"
                  padding="400"
                  paddingInline="400"
                  printHidden={false}
                  visuallyHidden={false}
                >
                  <InlineGrid
                    columns={{ xs: 1, sm: 1, lg: 2, xl: 2, md: 2 }}
                    alignItems="center"
                  >

                    {tabs && 
                    <Tabs
                      tabs={tabs}
                      selected={selected}
                      onSelect={handleTabChange}
                      disclosureText="More views"
                    />
                    }
                    <InlineStack wrap={true} gap="100" align="end">
                      <ButtonGroup
                        variant="segmented"
                        fullWidth={false}
                        connectedTop={false}
                        noWrap={false}
                      >
                        <button onClick={() => shopify.modal.show('my-modal')}>Open Modal</button>
                        <Tooltip content="Desktop View" dismissOnMouseOut>
                          <Button
                          disabled={disableDesktop}
                            size="large"
                            pressed={previewStyle === "desktop"}
                            onClick={() => {
                              handlePreviewStyle("desktop");
                            }}
                            icon={DesktopIcon}
                          >
                          </Button>
                        </Tooltip>
                        <Tooltip content="Tablet View" dismissOnMouseOut>
                          <Button
                          disabled={disableTablet}
                            size="large"
                            pressed={previewStyle === "tablet"}
                            onClick={() => {
                              handlePreviewStyle("tablet");
                            }}
                            icon={TabletIcon}
                          >
                            {/* <Icon source={TabletIcon}></Icon> */}
                          </Button>
                        </Tooltip>
                        <Tooltip content="Mobile View" dismissOnMouseOut>
                          <Button
                            size="large"
                            pressed={previewStyle === "mobile"}
                            onClick={() => {
                              handlePreviewStyle("mobile");
                            }}
                            icon={MobileIcon}
                          >
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </InlineStack>
                  </InlineGrid>
                </Box>
                <Divider borderColor="border-secondary" borderWidth="025" />
                <Box as="div" borderStyle="solid" paddingBlockEnd="400">
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 3, xl: 3 }}>
                      {/* <Scrollable  style={{ height: '70vh' }} > */}
                      {renderTabContent()}
                    </Grid.Cell>

                    <Grid.Cell
                      columnSpan={{ xs: 6, sm: 6, md: 6, lg: 9, xl: 9 }}
                    >
                      <Box padding={"300"}>



                        {/* <TabsLayout  settingfromDb={settingfromDb} /> */}

                          {/* { previewStyle === "mobile" && 

                          <Mobile />

                          } */}


{/* 
                          {previewStyle === "tablet" && 
                          
                          <Tablet />
                          
                          } */}


                        {/* {previewStyle === "desktop" &&  */}
                        <DesktopPreview  products={products} previewStyle={previewStyle} payload={finalsettings.globalSettings} />
                        {/* } */}
                      </Box>
                    </Grid.Cell>
                    <input
                      type="hidden"
                      name="payload"
                      value={JSON.stringify(finalsettings.globalSettings)}

                    />
                  </Grid>
                </Box>
              </Card>
            </Layout.Section>
            <Layout.Section />
          </Layout>
        </Page>
      </RecoraDiv>
    </Form>
  );
}
