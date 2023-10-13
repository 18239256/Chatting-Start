'use client';

import {signOut} from "next-auth/react";

const Users = () => {
    return (
        <button onClick={()=> signOut()}>
            注销
        </button>
    );
}

export default Users;