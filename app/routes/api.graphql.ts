import { json, type ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from 'app/shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);
    
    const body = await request.json();
    const { query, variables } = body;

    if (!query) {
      return json({ error: 'GraphQL query is required' }, { status: 400 });
    }

    // Execute GraphQL query
    const response = await admin.graphql(query, { variables: variables || {} });
    const data: any = await response.json();

    // Log for debugging
    if (data.errors) {
      console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2));
      return json({ 
        errors: data.errors,
        data: data.data || null 
      }, { status: 200 }); // GraphQL returns 200 even with errors
    }

    return json({ data: data.data });
  } catch (error: any) {
    console.error('Error executing GraphQL query:', error);
    console.error('Error stack:', error.stack);
    return json(
      { 
        error: 'Failed to execute GraphQL query',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
};

