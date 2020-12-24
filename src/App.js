import React,{useState, useEffect} from 'react';
import './App.css';
import {Criteria, TotalHits, Data, DynamicData} from './shomi-sample.json';
import EditIcon from './edit.svg';
import CheckIcon from './check.svg';
import CLoseIcon from './close.svg';


function App() {

  let totalMovies = Data.length;
  let numberOfPages = Math.ceil(totalMovies / 20);
  //console.log(numberOfPages)

  const[itemsShown, setItemsShown] = useState([]);

  const[expand, setExpand] = useState(-1);

  const[editable, setEditable] = useState(-1);

  const[currentPage, setCurrentPage] = useState(0);

  const[rendered, setOnRendered] = useState(false);

  const[tempName, setTempName] = useState("");
  const[tempDescription, setTempDescription] = useState("");
  
  const[sortOption, setSortOptions] = useState("name");

  useEffect(()=>{
    getData();
  },[currentPage,sortOption])


  let obj = {
    "name" : "ASC",
    "RunTimeSec" : "DESC",
    "year":"DESC"
  }

  function getData(params) {
    var requestOptions = {
      method: 'GET',
    };
    fetch("http://165.227.204.47:5000/"+sortOption+"/"+currentPage+`/${obj[sortOption]}`,requestOptions)
    .then(response => response.text())
    .then(result =>{
      console.log(JSON.parse(result).data);
      setItemsShown(JSON.parse(result).data)
    })
    .catch(error => console.log('error', error));
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getMinutesFromSeconds(d){
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay ;
  }

  function sortChanged(event){
    console.log(event.target.value);
    setSortOptions(event.target.value);
  }

  function expandFuction(i){
    console.log(expand, i)

    setExpand(i)
    // if(expand != -1){
    //   setExpand(i)
    // }
    // else{

    // }
    //setExpand(expand === i ? -1 : i)
  }

  function editItem(i){
    setEditable(i);
  }

  function updateField(name,description,id,index){

    console.log(itemsShown[index])
    let raw = JSON.stringify({
      "name":itemsShown[index].name,
      "description":itemsShown[index].description
    })

    let searchHeader = new Headers();
    searchHeader.append("Content-Type", "application/json");


    let requestOptions = {
      method: 'POST',
      headers: searchHeader,
      body: raw,
    };

    fetch("http://165.227.204.47:5000/update/"+id,requestOptions)
    .then(response => response.text())
    .then(result =>{
      // console.log(JSON.parse(result).data);
      // setItemsShown(JSON.parse(result).data)
    })
    .catch(error => console.log('error', error));
  }

  function edit(e,index){
    console.log(e.target.textContent);
    console.log(index);
    let tempArray = JSON.parse(JSON.stringify(itemsShown));
    tempArray[index].description = e.target.textContent;
    console.log(tempArray)
    setItemsShown(tempArray);
  }

  function editTitle(e,index){
    console.log(e.target.textContent);
    console.log(index);
    let tempArray = JSON.parse(JSON.stringify(itemsShown));
    tempArray[index].name = e.target.textContent;
    setItemsShown(tempArray);
  }


  return (
    <div>
      <div style={{margin:"5px 0"}}>
        <label htmlFor="sort_by">Sort By</label>
        <select id="sort_by" onChange={sortChanged} value={sortOption} style={{marginLeft:"10px"}}>
          <option value="name">A-Z</option>
          <option value="RunTimeSec">Duration</option>
          <option value="year">Date</option>
        </select>
        </div>
      <div className={`tiles-container`}>
        {
          itemsShown.map((item,i) => (
              <div 
                key={item.id ? item.id : "key"+i} 
                // className={`movie-tile ${expand === i ? "expand" : ""}`} 
                className={`movie-tile`} 
                style={{
                    backgroundImage: `linear-gradient(180deg, #5a2b9f, #313131)`
                }}
                // onClick={()=>{
                //   expandFuction(i)
                // }}
                // onBlur={()=>{
                //   setExpand(-1)
                // }}
                // tabIndex = "0"
                >
                  <div style={{position:"relative",height:"100%"}} className="bottom">
                    <div style={{position:"absolute",top:"0",right:"0"}}>
                      <img src={EditIcon} alt="Edit" height="17" style={{display:`${editable === i ? "none" : "inline"}`}} onClick={()=>{
                        editItem(i)
                        setTempDescription(item.description);
                        setTempName(item.name);
                      }}/>

                      <img src={CheckIcon} alt="Save" height="20" style={{display:`${editable === i ? "inline" : "none"}`}}  onClick={()=>{
                        // editItem(i)
                        updateField(item.name,item.description,item.id,i);
                        setEditable(-1)
                      }}/>

                      {/* <img src={CLoseIcon} alt="Edit" height="17" style={{display:`${editable === i ? "inline" : "none"}`,marginLeft:"10px"}}  onClick={()=>{
                        // editItem(i)
                        setEditable(-1);

                      }}/> */}
                    </div>
                    
                    <div >
                      
                      <div>
                        <span contentEditable={`${editable === i ? "true" : "false"}`} suppressContentEditableWarning={true}
                      onInput={(e)=>{editTitle(e,i)}} className="title">{item.name}</span>, {item.year}
                        </div> 
                      <div className="duration">{getMinutesFromSeconds(item.time)}</div>    
                      <div className="description" 
                      //style={{display:`${expand === i ? "block" : "none"}`}} 
                      suppressContentEditableWarning={true}
                      contentEditable={`${editable === i ? "true" : "false"}`}
                      onInput={(e)=>{edit(e,i)}}
                      >{item.description}</div>
                    </div>
                  </div>
                  
              </div>
          ))
        }
      </div>
      <div className="pagination">
        <div className={`${currentPage + 1 === 1 ? "active" : "" }`} onClick={()=>{setCurrentPage(0);}}>1</div>
        <div className={`${currentPage + 1 === 2 ? "active" : "" }`} onClick={()=>{setCurrentPage(1);}}>2</div>
        <div className={`${currentPage + 1 === 3 ? "active" : "" }`} onClick={()=>{setCurrentPage(2);}}>3</div>
        </div>
    </div>
  );
}

export default App;
