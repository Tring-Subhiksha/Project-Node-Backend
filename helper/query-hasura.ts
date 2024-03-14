import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export const QueryHasura = async (query: any, variables: any = {}, header: any = null) => {
    const hasuraadminsecret:string="Welcome@ta"
    const AWS_COGNITO_USERPOOL_ID = 'ap-south-1_NTWp0YeQl'
    const HASURA_BACKEND_URL='http://localhost:9090/v1/graphql'
    const headers = header || { 'x-hasura-admin-secret': hasuraadminsecret };
    const input = {
      method: 'post',
      url: `${HASURA_BACKEND_URL}`,
      headers,
      data: {
        query,
        variables,
      },
    };
    console.log("QueryHasura",JSON.stringify(input), QueryHasura.name);
    const resp = await axios(input);
    if (resp.data.errors) {
      console.error(`Error at QueryHasura *** ${resp.data.errors[0].message}`, resp.data.errors[0], QueryHasura.name);
      throw new Error(resp.data.errors[0].message);
    }
    return resp.data.data;
  };