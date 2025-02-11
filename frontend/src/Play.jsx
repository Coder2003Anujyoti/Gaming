import React,{useState,useEffect} from "react";
import {io} from "socket.io-client";
const socket=io("https://cruel-ginger-apisjdjjd-e9ce50b1.koyeb.app/");
const Play = () => {
 const [message,setMessage]=useState("");
 const [waiting,setWaiting]=useState(null)
 const [roomId,setRoomId]=useState(null);
 const [text,setText]=useState("");
 const [data,setData]=useState([]);
 const [disable,setDisable]=useState(false)
 const [gamestart,setGamestart]=useState(false)
  useEffect(()=>{
    socket.on("waiting",(data)=>{
      setWaiting(true);
    });
    socket.on("setname",(data)=>{
    setWaiting(false)
    setRoomId(data)
    });
    socket.on("playerLeft",(data)=>{
    alert(data)
    setDisable(true)
    })
    socket.on("gameStart",(data)=>{
      alert("Player has been joined.")
      setGamestart(true)
      setDisable(false)
      setData(data)
    })
    socket.on("winner",(data)=>{
      setData(data.info);
      setMessage(data.msg);
    })
    return ()=>{
      socket.off("waiting")
      socket.disconnect();
    };
  },[])
  const add=()=>{
    if(text.trim()!==''){
      socket.emit('addname',text,roomId)
    }
    else{
      alert("Input is required")
    }
  }
  const handlePick=(move)=>{
    if(disable==false){
      
    socket.emit("makemove",move,roomId);
    setMessage("");
    }
  }
  return (
    <>
  {gamestart===false && <>
  {waiting===true  ?
  <div className="w-full my-36 flex justify-center"><h1 className="font-bold text-xl text-black">Wait for connecting....</h1></div>:<div className="w-full flex flex-col justify-center items-center my-36">
      <div className="w-72 shadow-green-400 rounded-md p-16 bg-gradient-to-r from-violet-500 to-fuchsia-500">
   <div className="w-full flex text-center flex-col justify-center"> <h1 className="font-bold text-xl text-white">Login</h1></div>
      <div className="w-full my-4 flex flex-col justify-center items-center"><input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Enter Username..." className="w-64 font-bold text-slate-950 focus:outline-none rounded-md bg-white border-2 border-black" /></div>
          <div className="w-full my-4 flex flex-col justify-center items-center">
            <button onClick={add} className="p-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-tl-lg rounded-tr-lg rounded-br-lg font-bold">Submit</button></div>
      </div>
      </div>
    }
    </>}
  {gamestart===true && <>
    <div className="w-full flex justify-center flex-row flex-wrap my-20 gap-x-12">
    {data.map((i)=>{
      return(<>
        <div className="flex flex-col text-center justify-center gap-y-2">
  {i.choice===null && <img className="rounded-md w-28 h-28" src="images/rock-paper-scissors.png" />}
    {i.choice!=null && <img className="rounded-md w-28 h-28" src={`images/${i.choice}.png`} />}
        <h1 className="text-base shadow-slate-400 font-bold text-white">{i.name}</h1>
        </div>
      </>)
    })}
    </div>
        <div className="w-full flex flex-row flex-wrap justify-center gap-4 my-12">
  <img src="images/rock.png" className="rounded-md w-28 h-20" onClick={() => handlePick('rock')}></img>
  <img src="images/paper.png" className="rounded-md w-28 h-20" onClick={() => handlePick('paper')}></img>
  <img src="images/scissor.png" className="rounded-md w-28 h-20" onClick={() => handlePick('scissor')}></img>
  </div>
 {message!='' && <div className="w-full my-4 flex justify-center text-center">
    <h1 className="text-base shadow-slate-400 font-bold text-white">Winner-:{message}</h1>
  </div>}
  </>}
    </>
  );
};
export default Play;
