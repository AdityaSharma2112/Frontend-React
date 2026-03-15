import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import './App.css'
import useFetchPhotos from './customHooks/useFetchPhotos'
import { FaHeart } from "react-icons/fa";

function App() {
  const [count, setCount] = useState(0)
  const [input,setInput] = useState('')
  const [photos, loading, error] = useFetchPhotos()

  const favouriteReducer = (state, action) => {
    switch(action.type){
      case "toggle":
        const exists = state.find(p=>p.id===action.payload.id)
        if (exists){
          return state.filter(p=>p.id!==action.payload.id)
        }
        return [...state, action.payload]
      default:
        return state
    }
  }
  const getInitialFavourites = ()=>{
    const stored = localStorage.getItem('favourites')
    console.log(stored)
    return (stored!="undefined")? JSON.parse(stored): []
  }

  const [favourites, dispatch] = useReducer(
    favouriteReducer,
    [],
    getInitialFavourites
  )

  useEffect(()=>{
    console.log(favourites)
    localStorage.setItem("favourites",JSON.stringify(favourites))
  },[favourites])

  const filteredPhotos = useMemo(()=>{
    return photos.filter((photo) =>
                photo.author.toLowerCase().includes(input.toLowerCase())
                )
  },[photos,input])

  const handleSearch = useCallback((e)=>{
    setInput(e.target.value)
  },[])

   if(loading) return (
    //  <h1 className='text-green-400'>Loading...</h1>
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 pl-2">Loading photos...</p>
    </div>
    )
  if(error) return <h1>Error loading photos</h1>

  return (
    <>
      <div className='w-full h-screen'>
        <input type="text" placeholder='Search' className='m-5 border h-8 w-[30%] rounded-2xl pl-4 text-lg' value={input} onChange={handleSearch}/>
        <div className='w-full grid grid-cols-1  md:grid-cols-2
        lg:grid-cols-3 gap-1 bg-gray-800'>
            {filteredPhotos.map((photo)=>(
              <div key={photo.id} className='border bg-gray-100 rounded-xl p-2'>
                <img 
                  src={photo.download_url} 
                  alt=""
                  className='w-full object-cover row-span-1 col-span-1 p-2' />
                <div className='flex justify-evenly items-center'>
                  <label className=' text-xl text-gray-800'>{photo.author}</label>
                  <button className='flex border w-10 h-10 rounded-xl justify-center items-center' onClick={()=>dispatch({type:'toggle',payload: photo})}>
                    <FaHeart color={favourites.find(f=>f.id===photo.id)? 'red':'gray'}/>
                  </button>
                </div>
              </div>
            ))
            }
        </div>
      </div>
    </>
  )
}

export default App
