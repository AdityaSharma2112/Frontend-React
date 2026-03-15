import React, { useEffect, useState } from 'react'
import axios from 'axios'

function useFetchPhotos() {
    const[loading,setLoading] = useState(false)
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState(null)
    useEffect( ()=>{ const fetchData= async()=>{
        try{
            setLoading(true)
            const response = await axios("https://picsum.photos/v2/list?limit=30")
            console.log(response.data)
            setPhotos(response.data)
        }catch(e){
            console.log(e)
            setError(e)
        }finally{
            setLoading(false)
            }
        }
        fetchData()
        },[]
    )
    return [photos,loading,error]
}

export default useFetchPhotos