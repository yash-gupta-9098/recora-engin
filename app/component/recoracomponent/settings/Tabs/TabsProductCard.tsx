import {
    BlockStack,
    Box,
    Text,
    Icon,
    InlineStack,
    InlineGrid,
    RangeSlider,
    Collapsible,
    Select,
    Button,
    ButtonGroup,
    Popover,
    Divider,
    ActionList,
    Tooltip,
    TextField,
} from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useState } from 'react';

interface ProductImageSettings {
    ratio: string;
    onHover: boolean;
    showVariantImage: boolean;
    cropImage: boolean;
    cropType: 'top' | 'center' | 'bottom';
    padding: number;
    customClass: string;
}

interface ProductTitleSettings {
    color: string;
    showTitle: boolean;
    titleClip: boolean;
    fontSize: number;
    customClass: string;
    
}


interface ProductPriceSettings {
    showPrice: boolean;
    fontSize: number;
    color: string;
    comparePrice: {
        fontSize:number,
        showComparePrice: boolean;
        color: string;
    };
    variantPrice:{
        fontSize:number,
      showVariantPrice: boolean,
      color: string
    };
    singlePriceColor:string;
    showZeroToFree: boolean;
    customClass: string;
}


interface ProductCardSettings {
    cardStyle: "standard" | "card";
    textAlignType: "left" | "center" | "right";
    colorScheme: string;
    reviewType: string;
    wishlist: string;
    showVendor: boolean;
    customClass: string;
}



interface SettingsFromDb {
    colorScheme: { [key: string]: { background: string; text: string, border: string, text_Secondary: string } };
    productTitle: ProductTitleSettings;
    productImage: ProductImageSettings;
    productPrice: ProductPriceSettings;
    productCard: ProductCardSettings;
}

interface Props {
    settingfromDb: SettingsFromDb;
    dispatch: React.Dispatch<any>;
    developerMode:boolean;
}

const imageRatioOptions = [
    { label: 'Square', value: '1 / 1' },
    { label: 'Portrait (2:3)', value: '2/3' },
    { label: 'Landscape (3:2)', value: '3/2' },
    { label: 'Adapt to image', value: 'auto' },
]

const wishlistItems = [
  { label: 'Wishlist Plus', value: 'wishlist_pluse' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'lastWeek' },
];

const reviewItems = [
  { label: 'Loox', value: "Loox" },
  { label: 'Okendo', value: "Okendo" },
  { label: 'Judge.me', value: "Judge_me" },
  { label: 'Stamped', value: "Stamped" },
  { label: 'Yotpo', value: "Yotpo" },
  { label: 'Ali Reviews', value: "Ali_Reviews" },
  { label: 'Rapid Reviews', value: "Rapid_Reviews" },
  { label: 'Air Reviews', value: "Air_Reviews" },
  { label: 'None', value: "none" },
];




export default function TabsProductCard({ settingfromDb , dispatch , developerMode}: Props) {


 
    // console.log("settingfromDb in product card", settingfromDb);
    const [selectedColorSchemes, setSelectedColorSchemes] = useState<any>(settingfromDb.colorScheme);

   useEffect(() => {
 console.log("hello")
}, [settingfromDb , dispatch]);

    // Collapse section control
    const [openSection, setOpenSection] = useState<string | null>("Product_card");
    const handleToggle = (section: string) =>
        setOpenSection((prev) => (prev === section ? null : section));

    // // Heading
    // const [headingFontSize, setHeadingFontSize] = useState<number>(100);
    // const handleHeadingFontSize = useCallback((value: number) => {
    //     setHeadingFontSize(Math.min(Math.max(value, 80), 350));
    // }, []);

    // Product Image
    // const [imageRatioValue, setImageRatioValue] = useState<string>(
    //     settingfromDb.productImage.ratio
    // );
    // const [imageOnHover, setImageOnHover] = useState<boolean>(
    //     settingfromDb.productImage.onHover
    // );
    // const [showVariantImage, setShowVariantImage] = useState<boolean>(
    //     settingfromDb.productImage.showVariantImage
    // );
    // const [cropImage, setCropImage] = useState<boolean>(
    //     settingfromDb.productImage.cropImage
    // );
    // const [cropType, setCropType] = useState<'top' | 'center' | 'bottom'>(
    //     settingfromDb.productImage.cropType
    // );
    // const [paddingAround, setPaddingAround] = useState<number>(
    //     settingfromDb.productImage.padding
    // );

    // Product Title
    // const [showTitle, setShowTitle] = useState<boolean>(settingfromDb.productTitle.showTitle);
    // const [titleClip, setTitleClip] = useState<boolean>(settingfromDb.productTitle.titleClip);
    // const [productTitleColorValue, setProductTitleColorValue] = useState<string>(settingfromDb.productTitle.color);
    // const [p_titleFontSize, setP_titleFontSize] = useState<number>(settingfromDb.productTitle.fontSize);

    const ProductTitleColor = [
        {
            label: "Scheme 1",
            value: settingfromDb.colorScheme["Scheme 1"].text,
        },
        {
            label: "Scheme 2",
            value: settingfromDb.colorScheme["Scheme 2"].text,
        },
    ];


    






    // Product Price
    const [showPrice, setShowPrice] = useState(settingfromDb.productPrice.showPrice);
    const [p_priceFontSize, setP_priceFontSize] = useState(settingfromDb.productPrice.fontSize);
    const [productPriceColorValue, setProductPriceColorValue] = useState(settingfromDb.productPrice.color);

    const [showComparePrice, setComparePrice] = useState(settingfromDb.productPrice.comparePrice.showComparePrice);
    const [productComPriceColorValue, setProductComPriceColorValue] = useState(settingfromDb.productPrice.comparePrice.color);

    const [showZeroTofree, setShowZeroTofree] = useState(settingfromDb.productPrice.showZeroToFree);

    const ProductPriceColor = [
        { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
        { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text }
    ];

    const ProductComPriceColor = [
        { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
        { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text }
    ];

    const ProductVarColor = [
        { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
        { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text }
    ];


    const ProductSinglePriceColor = [
        { label: "Scheme 1", value: selectedColorSchemes["Scheme 1"].text },
        { label: "Scheme 2", value: selectedColorSchemes["Scheme 2"].text }
    ];




    // product Card 
    const [cardStyle, setCardStyle] = useState(settingfromDb.productCard.cardStyle);
    const [textAlignType, setTextAlignType] = useState(settingfromDb.productCard.textAlignType);
    const [colorSchemeValue, setColorSchemeValue] = useState(settingfromDb.productCard.colorScheme);
    // const [productReviewType, setProductReviewType] = useState(settingfromDb.productCard.reviewType);
    // const [selectedWishlist, setSelectedWishlist] = useState(settingfromDb.productCard.wishlist);
    // const [showVendor, setShowVendor] = useState(settingfromDb.productCard.showVendor);
    const [colorPopover, setColorPopover] = useState(false);



    // Toggle functions
    const toggleBoolean = (setter: (v: boolean) => void) =>
        setter((prev) => !prev);

    return (
        <Box
            as="ul"
            style={{ maxHeight: '600px', overflowY: 'scroll' }}
            borderStyle="solid"
            // overflowY='scroll'
        >

            {/* ProductCard */}
            <Box as="li" key={"settings_ProductCard"} borderStyle="solid" printHidden={false} visuallyHidden={false} borderBlockEndWidth='025' borderColor='border-secondary'>
                <Box as="div" padding={300} onClick={() => { handleToggle('Product_card') }} background={openSection === 'Product_card' ? "bg-fill-secondary" : "bg-fill"}>
                    <InlineStack gap="200" align="space-between" >
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight='bold'> Product Card </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon source={openSection === 'Product_card' ? ChevronUpIcon : ChevronDownIcon} tone="base" />
                        </InlineGrid>
                    </InlineStack>
                </Box>
                <Collapsible open={openSection === 'Product_card'} expandOnPrint={true} transition={true}>
                    <Box paddingBlock={400} paddingInline={300} position='relative' >
                        {/* <Box style={{ top: "-10px", position: "absolute", left: "10px", paddingInline: "10px" }} onClick={(e) => {
                            e.stopPropagation();
                            console.log("click")
                          }}><Icon source={ResetIcon} tone="magic" /></Box> */}
                        <BlockStack gap={300}>                            

                                    {/* Card Style: Standard / Card */}
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Style</Text>
                                        <Box background="bg-fill-secondary" borderRadius="200">
                                        <ButtonGroup variant="segmented">
                                            <Button
                                                size="slim"
                                                variant={settingfromDb.productCard.cardStyle === "standard" ? "secondary" : "tertiary"}
                                                onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {cardStyle: "standard"}})}
                                            >
                                                Standard
                                            </Button>
                                            <Button
                                                size="slim"
                                                variant={settingfromDb.productCard.cardStyle === "card" ? "secondary" : "tertiary"}
                                                onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {cardStyle: "card"}})}
                                            >
                                                Card
                                            </Button>
                                        </ButtonGroup>
                                        </Box>
                                    </InlineStack>

                                    {/* Text Alignment buttons */}
                                    <InlineStack gap="100" align='space-between' blockAlign="center">
                                        <Text as="p" variant="bodyMd">Alignment</Text>
                                        <ButtonGroup gap="loose" variant="segmented">
                                            <Tooltip content="Text Align Left" dismissOnMouseOut>
                                                <Button
                                                    size="micro"
                                                    pressed={settingfromDb.productCard.textAlignType === "left"}
                                                    onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "left"}})}
                                                >
                                                    <Icon source={TextAlignLeftIcon} />
                                                </Button>
                                            </Tooltip>

                                            <Tooltip content="Text Align Center" dismissOnMouseOut>
                                                <Button
                                                    size="micro"
                                                    pressed={settingfromDb.productCard.textAlignType === "center"}
                                                    onClick={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "center"}})}
                                                >
                                                    <Icon source={TextAlignCenterIcon} />
                                                </Button>
                                            </Tooltip>

                                            <Tooltip content="Text Align Right" dismissOnMouseOut>
                                                <Button
                                                    size="micro"
                                                    pressed={settingfromDb.productCard.textAlignType === "right"}
                                                    onClick={() =>  dispatch({type: "UPDATE_PRODUCT_CARD", payload: {textAlignType: "right"}})}
                                                >
                                                    <Icon source={TextAlignRightIcon} />
                                                </Button>
                                            </Tooltip>
                                        </ButtonGroup>
                                    </InlineStack>

                                    {/* Show Vendor toggle */}
                                    <ToggleRow
                                        label="Show vendor"
                                        enabled={settingfromDb.productCard.showVendor}
                                        onToggle={() => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {showVendor: !settingfromDb.productCard.showVendor}})}
                                    />

                                    {/* Color Scheme Popover */}
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Color Scheme</Text>
                                        <Popover
                                            active={colorPopover}
                                            activator={
                                                <Button variant="secondary" disclosure="select" onClick={() => setColorPopover(true)}>
                                                    {settingfromDb.productCard.colorScheme}
                                                </Button>
                                            }
                                            autofocusTarget="none"
                                            onClose={() => setColorPopover(false)}
                                        >
                                            <Popover.Pane fixed>
                                                <Popover.Section>
                                                    <p>Select Color Scheme</p>
                                                </Popover.Section>
                                            </Popover.Pane>
                                            <Divider />
                                            <Popover.Pane>
                                                <ActionList
                                                    actionRole="menuitem"
                                                    items={[
                                                        { content: 'Scheme 1', active: settingfromDb.productCard.colorScheme == "Scheme 1",  onAction: () => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {colorScheme: "Scheme 1"}}) },
                                                        { content: 'Scheme 2', active: settingfromDb.productCard.colorScheme == "Scheme 2",  onAction: () => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {colorScheme: "Scheme 2"}}) },
                                                    ]}
                                                />
                                            </Popover.Pane>
                                        </Popover>
                                    </InlineStack>


                                    {/* <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Card Scheme</Text>
                                <Select
                                    options={ProductCardColor}
                                    value={settingfromDb.productCard.colorScheme}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {colorScheme: value}})}
                                />
                            </InlineStack> */}

                                    {/* Review type selection */}
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Review</Text>
                                        <Select
                                            label=""
                                            options={reviewItems}
                                            value={settingfromDb.productCard.reviewType}
                                            onChange={(value : string ) => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {reviewType: value}})}
                                        />
                                    </InlineStack>

                                    {/* Wishlist app selection */}
                                    <InlineStack gap="100" align="space-between" blockAlign="center">
                                        <Text as="p" variant="bodyMd">Wishlist</Text>
                                        <Select
                                            label=""
                                            options={wishlistItems}
                                            value={settingfromDb.productCard.wishlist}
                                            onChange={(value : string) => dispatch({type: "UPDATE_PRODUCT_CARD", payload: {wishlist: value}})}
                                        />
                                    </InlineStack>

                                    
                                
                                    {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Product Card Class</Text>}
                  tone="magic"
                  value={settingfromDb.productCard.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_PRODUCT_CARD",
                      payload: { customClass: value  },
                    })
                  }
                  autoComplete="off"
                />
              )} 

                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>
                  

            
            {/* Product Title Section */}
            <Box
                as="li"
                key="settings_Product_title"
                borderStyle="solid"
                borderBlockEndWidth="025"
                borderColor="border-secondary"
            >
                <Box
                    padding={300}
                    onClick={() => handleToggle('Product_Title')}
                    background={openSection === 'Product_Title' ? 'bg-fill-secondary' : 'bg-fill'}
                >
                    <InlineStack gap="200" align="space-between">
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight="bold">
                                Product Title
                            </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon
                                source={openSection === 'Product_Title' ? ChevronUpIcon : ChevronDownIcon}
                                tone="base"
                            />
                        </InlineGrid>
                    </InlineStack>
                </Box>

                <Collapsible open={openSection === 'Product_Title'} expandOnPrint transition>
                    <Box paddingBlock={400} paddingInline={300} position="relative">
                        <BlockStack gap={300}>
                            <ToggleRow
                                label="Show"
                                enabled={settingfromDb.productTitle.showTitle}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_TITLE", payload: {showTitle: !settingfromDb.productTitle.showTitle}})}
                            />

                             {settingfromDb.productTitle.showTitle && (
                                <>
                            <InlineGrid gap="100">
                                <Text as="p" variant="bodyMd">Font size</Text>
                                <InlineStack gap="100" align="space-between" blockAlign="center">
                                    <RangeSlider
                                        label=""
                                        min={0.6}
                                        step={0.05}
                                        max={1.8}
                                        value={Number(settingfromDb.productTitle.fontSize)}
                                        onChange={(value :number) => 
                                            dispatch({type: "UPDATE_PRODUCT_TITLE", payload: {fontSize: Math.min(Math.max(value, 0.6), 1.8)}})
                                        }
                                        suffix={
                                            <p style={{ minWidth: '24px', textAlign: 'right' }}>
                                                <strong>{Math.floor((settingfromDb.productTitle.fontSize) * 20)}px</strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>

                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Color</Text>
                                <Select
                                    label={
            <Box
              as="span"
              style={{
                width: '20px',
                height: '20px',
                background: settingfromDb.productTitle.color,
                borderRadius: '50%',
                display: 'block',
              }}
            />
          }
                                    labelInline
                                    options={ProductTitleColor}
                                    value={settingfromDb.productTitle.color}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_TITLE", payload: {color: value}})}
                                />
                            </InlineStack>

                            <ToggleRow
                                label="Enable text clipping"
                                enabled={settingfromDb.productTitle.titleClip}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_TITLE", payload: {titleClip: !settingfromDb.productTitle.titleClip}})}
                                description="Restrict Titles to one line."
                            />
                           
                            
                            {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">TiTle Custom Class</Text>}
                  tone="magic"
                  value={settingfromDb.productTitle.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_PRODUCT_TITLE",
                      payload: { customClass: value  },
                    })
                  }
                  autoComplete="off"
                />
              )} 
               </>

                            )
                        }

                        </BlockStack>
                    </Box>
                </Collapsible>

            </Box>

            {/* Product Price  */}
            <Box as="li" key={"settings_Price"} borderStyle="solid" printHidden={false} visuallyHidden={false} borderBlockEndWidth='025' borderColor='border-secondary'>
                <Box as="div" padding={300} onClick={() => { handleToggle('Product_Price') }} background={openSection === 'Product_Price' ? "bg-fill-secondary" : "bg-fill"}>
                    <InlineStack gap="200" align="space-between" >
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight='bold'> Product Price </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon source={openSection === 'Product_Price' ? ChevronUpIcon : ChevronDownIcon} tone="base" />
                        </InlineGrid>
                    </InlineStack>
                </Box>
                <Collapsible open={openSection === 'Product_Price'} expandOnPrint={true} transition={true}>
                    <Box paddingBlock={400} paddingInline={300} position='relative' >
                        <BlockStack gap={300}>
                            <ToggleRow
                                label="Show"
                                enabled={settingfromDb.productPrice.showPrice}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {showPrice: !settingfromDb.productPrice.showPrice}})}
                            />


                        { settingfromDb.productPrice.showPrice && (
                            <>
                            {/* Price color selection */}
                            <InlineStack gap="100" align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">Price</Text>
                                <Select
                                label={
            <Box
              as="span"
              style={{
                width: '20px',
                height: '20px',
                background: settingfromDb.productPrice.color,
                borderRadius: '50%',
                display: 'block',
              }}
            />
          }
                                    labelInline
                                    options={ProductPriceColor}
                                    value={settingfromDb.productPrice.color}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {color: value}})}
                                />
                            </InlineStack>

                            {/* Font size for price */}
                            <InlineGrid gap="100">
                                <Text as="p" variant="bodyMd">Font size</Text>
                                <InlineStack gap="100" align="space-between" blockAlign="center">
                                    <RangeSlider
                                        label=""
                                        min={1}
                                        step={0.05}
                                        max={3}
                                        value={Number(settingfromDb.productPrice.fontSize)}
                                        onChange={(value : number) => 
                                            dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {fontSize: Math.min(Math.max(value, 1), 3)}})
                                            // setP_priceFontSize(Math.min(Math.max(value, 100), 300))
                                        }
                                        suffix={
                                            <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                <strong>{Math.floor(settingfromDb.productPrice.fontSize * 10)}px</strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>


                            {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Price Custom Class</Text>}
                  tone="magic"
                  value={settingfromDb.productPrice.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_PRODUCT_PRICE",
                      payload: { customClass: value  },
                    })
                  }
                  autoComplete="off"
                />
              )} 

                         {(settingfromDb.productPrice.comparePrice.showComparePrice || settingfromDb.productPrice.showPrice ) && (

                            <Divider />
                         )}


                            {/* Toggle for compare price display */}
                            <ToggleRow
                                label="Compare Price"
                                enabled={settingfromDb.productPrice.comparePrice.showComparePrice}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {comparePrice: {showComparePrice: !settingfromDb.productPrice.comparePrice.showComparePrice}}})}
                            />

                            {settingfromDb.productPrice.comparePrice.showComparePrice && ( <>

                            {/* Compare price color selection */}
                            <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                <Text as="p" variant="bodyMd">Color</Text>
                                <Select
                                    options={ProductComPriceColor}
                                    value={settingfromDb.productPrice.comparePrice.color}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {comparePrice: {color: value}}})}
                                />
                            </InlineStack>

                            <InlineGrid gap="100">
                                <Text as="p" variant="bodyMd">Font size</Text>
                                <InlineStack gap="100" align="space-between" blockAlign="center">
                                    <RangeSlider
                                        label=""
                                        min={1}
                                        step={0.05}
                                        max={3}
                                        value={Number(settingfromDb.productPrice.comparePrice.fontSize)}
                                        onChange={(value : number) => 
                                            dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {comparePrice: {fontSize: Math.min(Math.max(value, 1), 3)}}})
                                            // setP_priceFontSize(Math.min(Math.max(value, 100), 300))
                                        }
                                        suffix={
                                            <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                <strong>{Math.floor(settingfromDb.productPrice.comparePrice.fontSize * 10)}px</strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>

                            </>)}

                        


                        {(settingfromDb.productPrice.variantPrice.showVariantPrice || settingfromDb.productPrice.comparePrice.showComparePrice ) && (

                            <Divider />
                         )}


                            <ToggleRow
                                label="Variant Price"
                                enabled={settingfromDb.productPrice.variantPrice.showVariantPrice}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {variantPrice: {showVariantPrice: !settingfromDb.productPrice.variantPrice.showVariantPrice}}})}
                            />


                            {settingfromDb.productPrice.variantPrice.showVariantPrice && (
                                <>
                                <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                <Text as="p" variant="bodyMd">Color</Text>
                                <Select
                                    options={ProductVarColor}
                                    value={settingfromDb.productPrice.variantPrice.color}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {variantPrice: {color: value}}})}
                                />
                            </InlineStack>

                            <InlineGrid gap="100">
                                <Text as="p" variant="bodyMd">Font size</Text>
                                <InlineStack gap="100" align="space-between" blockAlign="center">
                                    <RangeSlider
                                        label=""
                                        min={1}
                                        step={0.05}
                                        max={3.8}
                                        value={Number(settingfromDb.productPrice.variantPrice.fontSize)}
                                        onChange={(value : number) => 
                                            dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {variantPrice: {fontSize: Math.min(Math.max(value, 1), 3.8)}}})
                                            // setP_priceFontSize(Math.min(Math.max(value, 100), 300))
                                        }
                                        suffix={
                                            <p style={{ minWidth: "24px", textAlign: "right" }}>
                                                <strong>{Math.floor(settingfromDb.productPrice.variantPrice.fontSize * 10)}px</strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>
                                
                                </>
                            ) }


                            {settingfromDb.productPrice.variantPrice.showVariantPrice  && (

                            <Divider />
                         )}

                            
                            <InlineStack gap="100" align="space-between" blockAlign="center" wrap={false}>
                                <Text as="p" variant="bodyMd">Single price Color</Text>
                                <Select
                                    options={ProductSinglePriceColor}
                                    value={settingfromDb.productPrice.singlePriceColor}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {singlePriceColor : value}})}
                                />
                            </InlineStack>


                            {/* Toggle for zero-to-free conversion */}
                            <ToggleRow
                                label="Zero price as free"
                                enabled={settingfromDb.productPrice.showZeroToFree}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_PRICE", payload: {showZeroToFree: !settingfromDb.productPrice.showZeroToFree}})}
                            />


</>
)}
                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>



            {/* Product Image Section */}
            <Box
                as="li"
                borderStyle="solid"
                borderBlockEndWidth="025"
                borderColor="border-secondary"
            >
                <Box
                    padding={300}
                    onClick={() => handleToggle('Product_Image')}
                    background={
                        openSection === 'Product_Image' ? 'bg-fill-secondary' : 'bg-fill'
                    }
                >
                    <InlineStack gap="200" align="space-between">
                        <InlineStack gap="100" align="space-between" blockAlign="center">
                            <Text as="h3" variant="headingSm" fontWeight="bold">
                                Product Image
                            </Text>
                        </InlineStack>
                        <InlineGrid alignItems='end'>
                            <Icon
                                source={
                                    openSection === 'Product_Image'
                                        ? ChevronUpIcon
                                        : ChevronDownIcon
                                }
                                tone="base"
                            />
                        </InlineGrid>
                    </InlineStack>
                </Box>

                <Collapsible
                    open={openSection === 'Product_Image'}
                    transition
                    expandOnPrint
                >
                    <Box paddingBlock={400} paddingInline={300} position="relative">
                        <BlockStack gap={300}>
                            <InlineStack gap={100} align="space-between" blockAlign="center">
                                <Text as="p" variant="bodyMd">
                                    Image Ratio
                                </Text>
                                <Select
                                    options={imageRatioOptions}
                                    value={settingfromDb.productImage.ratio}
                                    onChange={(value) => dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {ratio: value}})}
                                />
                            </InlineStack>

                            {/* Second image on hover */}
                            <ToggleRow
                                label="Second image on hover"
                                enabled={settingfromDb.productImage.onHover}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {onHover: !settingfromDb.productImage.onHover}})}
                            />

                            {/* Show variant image */}
                            <ToggleRow
                                label="Show Variant Image"
                                enabled={settingfromDb.productImage.showVariantImage}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {showVariantImage: !settingfromDb.productImage.showVariantImage}})}
                            />

                            {/* Crop image toggle */}
                            <ToggleRow
                                label="Crop media to fit"
                                enabled={settingfromDb.productImage.cropImage}
                                onToggle={() => dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {cropImage: !settingfromDb.productImage.cropImage}})}
                            />

                            {/* Crop position */}
                            <InlineGrid gap={100}>
                                <Text as="p" variant="bodyMd">
                                    Crop position
                                </Text>
                                <ButtonGroup gap="loose" variant="segmented">
                                    {['top', 'center', 'bottom'].map((pos) => (
                                        <Button
                                            key={pos}
                                            size="slim"
                                            pressed={settingfromDb.productImage.cropType === pos}
                                            onClick={() =>
                                                dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {cropType: pos}})}
                                        >
                                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </InlineGrid>

                            {/* Padding */}
                            <InlineGrid gap={100}>
                                <Text as="p" variant="bodyMd">
                                    Padding around Image
                                </Text>
                                <InlineStack
                                    gap={100}
                                    align="space-between"
                                    blockAlign="center"
                                >
                                    <RangeSlider
                                        label=" "
                                        min={0}
                                        step={1}
                                        max={25}
                                        value={settingfromDb.productImage.padding}
                                        onChange={(value) => dispatch({type: "UPDATE_PRODUCT_IMAGE", payload: {padding: value}})}
                                        suffix={
                                            <p style={{ minWidth: '24px', textAlign: 'right' }}>
                                                <strong>
                                                    {Math.floor((settingfromDb.productImage.padding))}px
                                                </strong>
                                            </p>
                                        }
                                    />
                                </InlineStack>
                            </InlineGrid>


                            {developerMode && (
                <TextField
                  label={<Text variant="bodyMd" as="span" tone="critical" fontWeight="bold">Image Custom Class</Text>}
                  tone="magic"
                  value={settingfromDb.productImage.customClass}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_PRODUCT_IMAGE",
                      payload: { customClass: value  },
                    })
                  }
                  autoComplete="off"
                />
              )} 

                        </BlockStack>
                    </Box>
                </Collapsible>
            </Box>



        </Box >
    );
}

// Reusable toggle switch UI
function ToggleRow({
    label,
    enabled,
    onToggle,
}: {
    label: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <InlineStack gap={100} align="space-between" blockAlign="center">
            <Text as="p" variant="bodyMd">
                {label}
            </Text>
            <Box
                style={{
                    width: '36px',
                    height: '20px',
                    position: 'relative',
                    borderRadius: 'var(--p-border-radius-100)',
                    background: enabled
                        ? 'var(--p-color-bg-inverse)'
                        : 'var(--p-color-icon-secondary)',
                }}
                padding={400}
                borderRadius="200"
                onClick={onToggle}
            >
                <Box
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--p-border-radius-050)',
                        background: 'var(--p-color-bg-surface)',
                        position: 'absolute',
                        top: '50%',
                        transform: enabled
                            ? 'translate(18px , -50%)'
                            : 'translate(5px , -50%)',
                        transition: 'transform var(--p-motion-duration-50) var(--p-motion-ease)',
                    }}
                />
            </Box>
        </InlineStack>
    );

}