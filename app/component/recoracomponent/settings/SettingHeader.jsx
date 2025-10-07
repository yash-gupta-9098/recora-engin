import { Button, InlineStack, Text } from "@shopify/polaris";
import {  ArrowLeftIcon } from '@shopify/polaris-icons';

import React from 'react'

const SettingHeader = ({BackButton , Heading}) => {
  return (
    <InlineStack align={"start"} gap={400}>

    { BackButton && (
        <Button icon={ArrowLeftIcon} accessibilityLabel="Back to previous menu" />    )
    }
          
          <Text as="h2" variant="headingLg">{Heading}</Text>
        </InlineStack> 
  )
}

export default SettingHeader