'use client'
import { useEffect, useState } from "react";
import useProfile from "../../components/UseProfile";
import UserTabs from "../../components/layout/UserTabs";
import Link from "next/link";

export default function UsersPage() {

    const [users,setUsers] = useState([]);    
    const {loading, data} = useProfile();

    useEffect(()=>{
        fetch('/api/users')
        .then((response)=>response.json())
        .then((data)=>setUsers(data))
    },[])

    if(loading) {
        return 'Loading user info...';
    }

    if(!data)
    {
        return 'Not an admin';
    }
    console.log(data)

    return(
        <section className="max-w-2xl mx-auto mt-8">
            <UserTabs isAdmin={true} />
            <div className="mt-8">
                {users.length > 0 && users.map(user =>(
                    <div className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4" key={user._id}>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                            <div className="text-gray-700">
                                {!!user.name && (<span>{user.name}</span>)}
                                {!user.name && (<span className="italic">No name</span>)}
                            </div>                           
                            <span>{user.email}</span>
                       </div>
                       <div>
                            <Link className="button" href={'/users/'+user._id}>Edit</Link>
                       </div>     
                    </div>
                ))}
            </div>
        </section>
    );
}