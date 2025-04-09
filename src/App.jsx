import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

function App() {
  const [osztalyok, setOsztalyok] = useState([]);
  const [tan, setTan] = useState([]);
  const [tanE, setTanE] = useState(false);

  const [nev, setNev] = useState("");
  const [kep, setKep] = useState("");
  const [nem, setNem] = useState("");
  const [kor, setKor] = useState("");
  const [oazZ, setOaz] = useState("");
  const [i, setI] = useState("");

  const [fo, setFo] = useState("");
  const [oszt, setOszt] = useState("");

  const [fiu, setFiu] = useState(false);
  const [lany, setLany] = useState(false);
  const [d, setD] = useState(false);

  useEffect(() => {
    async function getOsztalyok() {
      const resp = await fetch("http://localhost:88/osztalyok");
      const json = await resp.json();
      setOsztalyok(json);
      console.log(json);
    }
    getOsztalyok();
  }, []);

  async function getTanulok(oaz) {
    const resp = await fetch("http://localhost:88/tanulok/" + oaz);
    const json = await resp.json();
    setTan(json);   setFo(json.length); 
    console.log(json);
  }

  async function felvesz() {
    let oazI = oazZ;
    let nev = document.getElementById("nev").value;
    let kor = document.getElementById("kor").value;
    let kep = document.getElementById("kep").value;
    let nem = "";
    if(document.getElementById("lany").checked){  nem = "L"}  
    if(document.getElementById("fiu").checked){ nem = "F"}  
    console.log(nev, kor, nem, kep, oazI);
    const adat = {nev:nev, kor:kor, nem:nem, kep:kep, oaz:oazI}
    const resp = await fetch("http://localhost:88/tanulok/", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(adat)
    });
    const json = await resp.json();
  }

  async function dele(id) {
    const resp = await fetch("http://localhost:88/tanulo/"+id, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    });
  }

  async function change(){
    let taz = i;
    let oazI = oazZ;
    let nev = document.getElementById("nev").value;
    let kor = document.getElementById("kor").value;
    let kep = document.getElementById("kep").value;
    let nem = "";
    if(document.getElementById("lany").checked){  nem = "L"}  
    if(document.getElementById("fiu").checked){ nem = "F"}  
    console.log(nev, kor, nem, kep, oazI);
    const adat = {nev:nev, kor:kor, nem:nem, kep:kep, oaz:oazI}
    const resp = await fetch("http://localhost:88/tanulo/"+taz, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(adat)
    });
    const json = await resp.json();
  }

  function katt(a){
    getTanulok(a.oaz);
    setOaz(a.oaz);
    setOszt(a.osztaly); console.log(a.osztaly);
  
  }

  function alakit(x){
    setNev(x.nev);
    setKep(x.kep);
    setKor(x.kor);
    setI(x.taz); 
    setTanE(true);
    if(x.nem == "L") {setLany(true);setFiu(false)}
    if(x.nem == "F") {setFiu(true); setLany(false)}
    if((!tanE)) document.getElementById("fel").disabled = false;
  }

  function megse(){
    setNev("");
    setKep("");
    setKor("");
    setI("");
    setLany(false); setFiu(false);  setTanE(false);  if(tanE) document.getElementById("fel").disabled = true;
  }


  return (
    <div className='app'>
      <div className='osz'>
        <div className='fel'> <span className='p'>Osztályok</span></div>
        <div className='als'>
          {osztalyok.map(x =>
            <div className='belso'>
              <img src={x.ofokep} /><br />
              {x.ofonev} <br /><br />
              <span className='gomb' onClick={()=>katt(x)} > {x.osztaly}</span>
            </div>
          )}
        </div>
      </div><br />
      <div className='osz'>
        <div className='fel'> <span className='p'>Tanulók <span>({fo} fő)</span>  <span style={{fontWeight:"bold", fontSize:"16px"}}>{oszt}</span></span></div>
        <div className='als'>
          {tan.map(x =>
            <div className='belso' onClick={()=>alakit(x)}>
              <img src={x.kep} /><br />
              <span>{x.nev}</span>
            </div>
          )}
        </div>
      </div><br />
      
      <div className='osza'>
          <div className='inpfel'>
              Név: <input type="text" placeholder='név' id='nev' style={{marginLeft:"10px", marginRight:"5px"}} onChange={e => setNev(e.target.value)} value={nev}/>
              Kor: <input type="text" placeholder='kor' id='kor' style={{marginLeft:"10px", marginRight:"5px"}} onChange={e => setKor(e.target.value)} value={kor}/>
              Nem: <input type="radio" name="c" id="lany" style={{marginLeft:"10px", marginRight:"5px"}} value={lany} onSelect={()=>setLany(true)} checked={lany}/> Lány / <input checked={fiu} value={fiu} onSelect={()=>setFiu(true)} type="radio" name="c" id="fiu" /> Fiú 
          </div><br />
          Kép: <input placeholder='kép url' type="text" id='kep' style={{width:"90%"}} onChange={e => setKep(e.target.value)} value={kep}/> <br />
          <input type="button" id="fel" disabled value="Felvesz" style={{width:"100px",borderRadius:"5px", marginTop:"10px", border:"1px solid grey", padding:"5px", marginRight:"10px"}} onClick={felvesz}/>
          <input type="button" value="Töröl" style={{width:"100px",borderRadius:"5px", padding:"5px",  border:"1px solid grey",marginRight:"10px"}} onClick={(()=>dele(i))} />
          <input type="button" value="Módosít" style={{width:"100px",borderRadius:"5px", padding:"5px",  border:"1px solid grey",marginRight:"10px"}} onClick={change}/>
          <input type="button" value="Mégsem" style={{width:"100px",borderRadius:"5px", padding:"5px",  border:"1px solid grey",marginRight:"10px"}} onClick={megse}/>
      </div>
    </div>
  )
}

export default App
