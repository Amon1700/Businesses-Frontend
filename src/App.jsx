import { useState, useEffect } from "react"
import axios from "axios"


export default function App() {

  const [location, setlocation] = useState({})

  const [data, setdata] = useState({})

  const [flag, setflag] = useState(true)

  const [cate, setcate] = useState("")

  const arr = [
    [0, "restaurants"],
    [1, "auto services"],
    [2, "home services"],
    [3, "hotels"],
    [4, "grocery store"],
    [5, "clothing stores"],
  ]

  const getlocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setlocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
        (error) => {
          console.error(`Error Code = ${error.code} - ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const call = async (val) => {
    if(!data[val]){
      await axios.post("http://localhost:3000",
      {
        "business": `${val}`,
        "latitude": `${location.latitude}`,
        "longitude": `${location.longitude}`
      })
      .then((res) => {
        
        setdata(pre => ({ ...pre, [val]: res.data.sort((a, b) => b.rating - a.rating) }))
      })
      .catch((err) => { console.log(err) })
    }
  }

  useEffect(() => {
    if (!location.latitude && !location.longitude) {
      getlocation()
    }

    if (location.latitude && location.longitude) {
      arr.map((val) => call(val[1]))
    }
  }, [location])

  return (

    <div className="bg-indigo-950 h-screen flex justify-center items-center">
      <div className={`${flag ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out z-10 grid grid-rows-2 grid-cols-2 md:text-3xl text-x;  gap-4 uppercase`}>
        {arr.map(category =>
          <div className={
            `${data[category[1]] ? " text-yellow-500 hover:text-yellow-300 bg-blue-700 border-blue-700 hover:border-indigo-500 "
              : "bg-gray-700 border-gray-700 text-indigo-950 "} 
            md:h-[200px] h-[100px] md:w-[250px] w-[150px] p-4 text-center rounded-xl flex justify-center items-center border-4
            duration-200 ${!data[category[1]] ? "animate-fadeInOut" : ""}`} key={category[0]} onClick={() => {data[category[1]] && setflag(!flag), setcate(category[1])}} >
            <div >{category[1]}</div>
          </div>
          )
        }
      </div>
      <div className= {`${!flag ? "opacity-100 z-20" : "opacity-0 z-0"} fixed transition-opacity duration-300 ease-in-out text-yellow-500 md:text-xl  flex flex-col`}>
    <div className="text-center md:text-3xl text-2xl  mb-4 p-4 rounded-xl uppercase bg-blue-700 flex flex-row justify-items-start">
      <button className="hover:text-yellow-300 duration 200" onClick={() => {setflag(!flag)}}>❮</button>
      <div className="m-auto">{cate}</div>
    </div>
    <div className="h-[75vh] overflow-scroll p-4 border-2 border-blue-700 rounded-xl">

      {data[cate] ? data[cate].map(ele =>
        <div key={ele.url} className="flex justify-between items-center gap-3 p-4 flex-row md:w-[700px] w-[300px] h-[50px] border-2 rounded-xl
  border-blue-700 mt-2 hover:border-indigo-500 hover:text-yellow-300 duration-200">
          <div><a href={ele.url} target="_blank">{ele.name.slice(0, 20)}...</a></div>
          <div>{ele.rating}  ⭐</div>
        </div>
      )
        : <div className="flex justify-between items-center gap-3 p-4 flex-row md:w-[700px] w-[300px] h-[50px] border-2 rounded-xl
  border-blue-700 mt-2 hover:border-indigo-500 hover:text-yellow-300 duration-200">
          <div><a href="" target="_blank">loading...</a></div>
          <div></div>
        </div>
      }
    </div>
  </div>
    </div>
  ) 


}
