import { BlockStack, Box, Button, Card, Collapsible, ColorPicker, Divider, Grid, InlineGrid, InlineStack, Layout, OptionList, Popover, ProgressBar, Text, TextField, Thumbnail } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import RecoraDiv from '../RecoraDiv'
import { useDispatch, useSelector } from 'react-redux';
import { showtab } from '../../slice/adminSlice/stapes';
import RecoraPageWrapper from '../RecoraPageWrapper';
import {
    IconsIcon
} from '@shopify/polaris-icons';
const SetupStep = () => {
    // const [clickAbleIndex , setClickAbleIndex] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showtab({ clickAbleIndex: 0, progress: 0 }));
    }, [dispatch])
    const handleCardButton = (index) => {
        dispatch(showtab({ clickAbleIndex: index, progress: index }))
    }
    const { clickAbleIndex, progress } = useSelector(state => (state.setupTab))

    const [selectedOption, setSelectedOption] = useState(['0']);
    const [styleOption, setStyleOption] = useState(false);

    const handleStyleOption= useCallback(() => setStyleOption((open) => !open), []);

    const handleOptionList= useCallback((value)=> {
        setSelectedOption(value)
        handleStyleOption();
    })
    
    const [popoverActive, setPopoverActive] = useState(true);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
      );
    
      const activator = (
        <Button onClick={togglePopoverActive} disclosure>
          Options
        </Button>
      );

    const steps = [{
        title: "1 Similer card Button"
    }, {
        title: "Launch Point"
    },
    {
        title: "Wishlist Page"
    }
    ]



    const iconPetterns = [{
        title: "Plain Button with Icon",
        src: "https://procdn.swymrelay.com/embed/assets/plainBtnIcon.png",
    }, {
        title: "Plain Button without Icon",
        src: "https://procdn.swymrelay.com/embed/assets/solidBtn.svg",
    },
    {
        title: "Icon-only Plain Button",
        src: "https://procdn.swymrelay.com/embed/assets/iconOnly.png"

    },
    {
        title: "Solid Button with Icon",
        src: "https://procdn.swymrelay.com/embed/assets/solidBtnIcon.svg"
    }
    ]






    return (
        <RecoraPageWrapper style={{ maxWidth: "1440px", height: "100%", margin: "0 auto" }}>
            <BlockStack gap={1000}>
                <RecoraDiv style={{ maxWidth: "1024px", margin: "0 auto", width: "100%", }}>
                    <Layout>
                        {steps.map((_, index) => {
                            let open = (index === clickAbleIndex);

                            // Update progress based on index
                            let updateProgress = (index < progress) ? 100 : 0;

                            return (<Layout.Section key={index} variant="oneThird">
                                <Box onClick={() => handleCardButton(index)} style={{ opacity: (updateProgress > 0) ? "0.5" : "1" }}>
                                    <BlockStack gap="200" >
                                        <Text as="p" variant="bodyMd" alignment='center' fontWeight={open ? "bold" : "reguler"}>1 Similer card Button</Text>
                                        <ProgressBar progress={updateProgress} size="small" tone="success" />
                                    </BlockStack>
                                </Box>
                            </Layout.Section>
                            )
                        })}

                    </Layout>
                </RecoraDiv>

                <InlineGrid gap="400" columns={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}>
                    <Card padding={0}>
                        <img width="100%" src="https://procdn.swymrelay.com/embed/assets/customizationPreviewBackgroundPdp.svg" />

                    </Card>
                    <Card padding={800}>

                        <BlockStack gap={800} >
                            <InlineStack gap={200} blockAlign="center" wrap={false}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4558 6.45563L12.7395 4.37505C12.2133 4.18354 11.6315 4.45484 11.44 4.98101L9.28209 4.98101L9.88128 3.33476C10.2643 2.28241 11.4279 1.73982 12.4803 2.12284L20.1021 4.89695C21.1544 5.27997 21.697 6.44357 21.314 7.49592L17.1528 18.9286C16.8955 19.6357 16.2857 20.1126 15.5941 20.2333V17.2824L19.0618 7.75512C19.2533 7.22895 18.982 6.64714 18.4558 6.45563ZM10.6109 12.8752H9.59708V11.8613C9.59708 11.5924 9.49026 11.3345 9.30012 11.1444C9.10999 10.9543 8.8521 10.8474 8.58321 10.8474C8.31432 10.8474 8.05643 10.9543 7.8663 11.1444C7.67616 11.3345 7.56934 11.5924 7.56934 11.8613V12.8752H6.55547C6.28658 12.8752 6.0287 12.982 5.83856 13.1721C5.64842 13.3623 5.5416 13.6202 5.5416 13.8891C5.5416 14.1579 5.64842 14.4158 5.83856 14.606C6.0287 14.7961 6.28658 14.9029 6.55547 14.9029H7.56934V15.9168C7.56934 16.1857 7.67616 16.4436 7.8663 16.6337C8.05643 16.8238 8.31432 16.9307 8.58321 16.9307C8.8521 16.9307 9.10999 16.8238 9.30012 16.6337C9.49026 16.4436 9.59708 16.1857 9.59708 15.9168V14.9029H10.6109C10.8798 14.9029 11.1377 14.7961 11.3279 14.606C11.518 14.4158 11.6248 14.1579 11.6248 13.8891C11.6248 13.6202 11.518 13.3623 11.3279 13.1721C11.1377 12.982 10.8798 12.8752 10.6109 12.8752ZM11.6248 7.80584C12.1848 7.80584 12.6387 8.25977 12.6387 8.81971V18.9584C12.6387 19.5183 12.1848 19.9723 11.6248 19.9723H5.54161C4.98166 19.9723 4.52774 19.5183 4.52774 18.9584L4.52774 8.81971C4.52774 8.25977 4.98166 7.80584 5.5416 7.80584H11.6248ZM2.5 7.80584C2.5 6.68595 3.40785 5.7781 4.52774 5.7781H12.6387C13.7586 5.7781 14.6664 6.68595 14.6664 7.80584V19.9723C14.6664 21.0921 13.7586 22 12.6387 22H4.52774C3.40785 22 2.5 21.0921 2.5 19.9723V7.80584Z" fill="#0F1111"></path>
                                </svg>
                                <Text variant='bodyLg' fontWeight='medium'> Shoppers can wishlist their favorite products using this button </Text>
                            </InlineStack>

                            {/* <Grid >
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 12, xl: 6 }}>
                                        <Box height="100%">
                                        <Text as="p" variant='bodyLg' fontWeight='bold'>Style</Text>
                                        <Card>

                                            <InlineStack gap={400} blockAlign="center" wrap={false}>
                                                <Thumbnail source={IconsIcon} size="large" alt="Small document" />
                                                <Text variant='bodyLg' fontWeight='medium'> Icon-only Plain Button </Text>
                                            </InlineStack>
                                        </Card>
                                        </Box>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 12, xl: 6 }}>
                                        <Box >
                                        <Text as="p" variant='bodyLg' fontWeight='bold'>Colors</Text>
                                        <Card height="100%">
                                            <Text variant='bodyLg' fontWeight='medium'> Shoppers can wishlist their favorite products using this button </Text>
                                        </Card>
                                        </Box>
                                    </Grid.Cell>
                                </Grid> */}
                            {/* <BlockStack gap={200}>
                                <Text as="p" variant='bodyMd' fontWeight='bold'>Style</Text>
                                <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}>
                                {iconPetterns.map((IconStyle)=>
                                    <Card>
                                        <InlineStack gap={400} blockAlign="center" wrap={false}>
                                            <Thumbnail source={IconStyle.src} size="medium" alt="Small document" />
                                            <Text variant='bodyLg' fontWeight='medium'>{IconStyle.title}</Text>
                                        </InlineStack>
                                    </Card>
                                )}
                                </InlineGrid>
                            </BlockStack>
                             */}
                            <BlockStack gap={300}>


                                <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}>
                                    <Card>
                                        <BlockStack gap={300}>
                                            <Text as="p" variant='bodyMd' fontWeight='bold'>
                                                Colors
                                            </Text>
                                            <Divider />
                                            <BlockStack gap={100}>
                                                <InlineStack gap={200}>
                                                    <div className='view-color' width="50px" height="50px" style={{ background: "#222222", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                    <BlockStack>
                                                        <Text as="p" fontWeight='semibold'>Primary Color</Text>
                                                        <Text as="p">#222222</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                                <InlineStack gap={200}>
                                                    <div className='view-color' width="50px" height="50px" style={{ background: "#121212", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                    <BlockStack>
                                                        <Text as="p" fontWeight='semibold'>Contrasting Color</Text>
                                                        <Text as="p">#121212</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            </BlockStack>
                                            <BlockStack>


                                            </BlockStack>

                                        </BlockStack>
                                    </Card>
                                    <Card>
                                        <BlockStack gap={300}>
                                            <Text as="p" variant='bodyMd' fontWeight='bold'>
                                                Style
                                            </Text>
                                            <Divider />
                                            <Box role="button" onClick={handleStyleOption}  ariaExpanded={open}
                                                ariaControls="recora-select-style">
                                            <InlineStack gap={400} blockAlign="center" wrap={false}>                                                
                                                {selectedOption == "0" && (<><Thumbnail source={iconPetterns[0].src} size="large" alt="Small document" />
                                                    <Text variant='bodyLg' fontWeight='medium'>{iconPetterns[0].title}</Text></>
                                                )}
                                                {selectedOption == "1" && (<><Thumbnail source={iconPetterns[1].src} size="large" alt="Small document" />
                                                    <Text variant='bodyLg' fontWeight='medium'>{iconPetterns[1].title}</Text></>
                                                )}
                                                {selectedOption == "2" && (<><Thumbnail source={iconPetterns[2].src} size="large" alt="Small document" />
                                                    <Text variant='bodyLg' fontWeight='medium'>{iconPetterns[2].title}</Text></>
                                                )}
                                                {selectedOption == "3" && (<><Thumbnail source={iconPetterns[3].src} size="large" alt="Small document" />
                                                    <Text variant='bodyLg' fontWeight='medium'>{iconPetterns[3].title}</Text></>
                                                )}
                                                
                                            </InlineStack>
                                            </Box>
                                            
                                                <Collapsible open={styleOption} id="recora-select-style" transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
            expandOnPrint>
                                            <Box position={styleOption ? "fixed" : "relative"} zIndex="99">
                                               <Card>
                                                    <OptionList
                                                        onChange={(value)=> { handleOptionList(value)}}
                                                        allowMultiple= {false}
                                                        options={[
                                                            {
                                                                value: '0',
                                                                label: 'Plain Button with Icon',
                                                            },
                                                            { value: '1', label: 'Plain Button without Icon' },
                                                            {
                                                                value: '2',
                                                                label: 'Solid Button with Icon',
                                                            },
                                                            { value: '3', label: 'Icon-only Plain Button' },                                                            
                                                        ]}
                                                        selected={selectedOption}
                                                    />
                                                </Card>
                                            </Box>
                                                </Collapsible>
                                            
                                        </BlockStack>
                                    </Card>
                                </InlineGrid>
                            </BlockStack>

                            {/* <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}>
                                <Card background="">
                                    <BlockStack gap={200}>
                                        <Text as="h2" variant="headingSm">Style</Text>
                                        <InlineStack gap={400} blockAlign="center" wrap={false}>
                                            <Thumbnail source={IconsIcon} size="large" alt="Small document" />
                                            <Text variant='bodyLg' fontWeight='medium'> Icon-only Plain Button </Text>
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                                <Card background="bg-fill-transparent">
                                    <BlockStack gap={200}>
                                        <Text as="h2" variant="headingSm">
                                            Colors
                                        </Text>
                                        <Box>
                                            <Text>yashj</Text>
                                        </Box>
                                    </BlockStack>
                                </Card>
                            </InlineGrid> */}

                        </BlockStack>


                    </Card>
                </InlineGrid>



            </BlockStack>
        </RecoraPageWrapper>
    )
}

export default SetupStep