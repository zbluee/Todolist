export const getDate = ()=>{
  const timeStamp = Date.now();
  const dt = new Date(timeStamp);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return dt.toLocaleString("en-US", options);
}

export const getDay = ()=> {
  const timeStamp = Date.now();
  const dt = new Date(timeStamp);
  const options = {
    weekday: "long",
  };
  return dt.toLocaleString("en-US", options);
}
