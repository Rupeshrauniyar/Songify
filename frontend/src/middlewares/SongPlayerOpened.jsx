import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useUser} from "../context/UserContext";
import {useEffect, useState} from "react";

const SongPlayerOpened = () => {
  const {setOpen} = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("open");
  // console.log(query);
  useEffect(() => {
    setOpen(query && query === "true" ? true : false);
  }, [query]);
  return <Outlet />;
};

export default SongPlayerOpened;
