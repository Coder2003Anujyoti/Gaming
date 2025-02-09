import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://gaming-u1z1.onrender.com/'); // Adjust the URL if needed

const App = () => {
    const [playerName, setPlayerName] = useState('');
    const [picked, setPicked] = useState('');
    const [result, setResult] = useState(null);
    const [picks, setPicks] = useState([]);
    const [display,setDisplay]=useState(true)
    const [load,setLoad]=useState(false)
    useEffect(() => {
        socket.on('result', (data) => {
            setLoad(false)
            setResult(data);
            setPicks(data.picks);
        });
     return () => {
            socket.off('result');
        };
        
    }, []);

    const handlePick = (choice) => {
        if (!playerName) {
            alert('Please enter your name first!');
            return;
            setDisplay(true)
            setLoad(false)
        }
        else{
       // setPicked(choice);
        socket.emit('picked', { player: playerName, picked: choice });
        setDisplay(false)
        setLoad(true)
        }
    };

    return (
        <div className="text-black">
  <div className="w-full py-16 flex justify-center"><h1 className="text-xl shadow-slate-400 font-bold text-gray-400">Rock-Paper-Scissors Game</h1></div>
      {display===true && <>
    <div className="w-full  flex justify-center">
   <input  type="text" placeholder="Enter your name"  value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="bg-black focus:outline-none text-slate-400 font-bold rounded-md"/>
   </div>
  </>}
 {load===false && <>
  <div className="w-full flex flex-row flex-wrap justify-center gap-4 my-12">
  <img src="images/rock.png" className="rounded-md w-28 h-20" onClick={() => handlePick('rock')}></img>
  <img src="images/paper.png" className="rounded-md w-28 h-20" onClick={() => handlePick('paper')}></img>
  <img src="images/scissor.png" className="rounded-md w-28 h-20" onClick={() => handlePick('scissor')}></img>
  </div>
 </>}
 {result && 
   <div className="w-full flex justify-center flex-col text-center ">
  <h2 className="text-xl shadow-slate-400 font-bold text-gray-400">{result.message}</h2>
  <div className="w-full flex flex-row justify-center my-8 gap-12">
 {picks.map((pick, index) => {return(<>
                          <div className="flex flex-col text-center">
        <img className="rounded-md w-28 h-20" src={`images/${pick.picked}.png`} />
        <p className="text-base shadow-slate-400 font-bold text-gray-400">{pick.name}</p>
                          </div>
                        </>)
                           
                        })}
                  </div>
                </div>
            }
        </div>
    );
};

export default App;