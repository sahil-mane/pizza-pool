"use client"
import { useEffect, useState } from "react";

export default function useProfile() {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData,setProfileData] = useState([])

    useEffect(()=>{
        setLoading(true);
        fetch('/api/profile')
        .then(response => response.json())
        .then(data=>{
            setData(data.admin);
            setLoading(false);
            setProfileData(data);
        })
    },[]);

    return {loading , data , profileData};
}

