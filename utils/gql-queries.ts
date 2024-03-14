export const InsertUser=`
mutation InsertUser($email: String = "", $password: String = "", $username: String = "", $u_cognito_id: String = "") {
    insert_users(objects: { u_email_id: $email, u_password: $password, u_username: $username, u_cognito_id: $u_cognito_id}) {
      returning {
        u_email_id
        u_password
        u_username
        u_cognito_id
      }
    }
  }
`;
export const GetUsersByEmail=`
query getUsersByEmail($email: String = "") {
    users(where: {u_email_id: {_eq: $email}}) {
      u_username
      u_password
      u_email_id
      u_address
      u_cognito_id
      u_date_of_birth
      u_first_name
      u_id
      u_last_name
      u_mobile_number
    }
  }
  `;
  export const verifyCode=`
  mutation UpdateUserIsConfirmed($email: String!) {
    update_users(
      where: { u_email_id: { _eq: $email } }
      _set: { is_confirmed: "true" }
    ) {
      affected_rows
      returning {
    u_email_id
        is_confirmed
     }
    }
  }  
  `;
  export const UpdatePassword=`
  mutation UpdatePassword($email: String!, $newPassword: String!){
    update_users(where: {u_email_id: {_eq: $email}}, _set: {u_password: $newPassword}) {
      affected_rows
    }
  } 
  `;