import React from "react";
import { supabase } from "/lib/supabaseClient.js";
import Link from "next/link";
import Body from "/components/Body";
// import getServerSideProps from './CallServer'
import { signInWithGitHub } from "../login.js";
function GuestBookPage({ guestbook }) {
  function GithubAuth() {
    supabase.auth.signIn({
      provider: "github",
    });
  }
  const messageinput = React.useRef();
  const [message, setmessage] = React.useState(null);
  const [username, setusername] = React.useState("eliaschen");
  const [date, setdate] = React.useState(null);
  const [messagenull, setmessagenull] = React.useState(false);
  const [loading, setloading] = React.useState(true);
  const [guestbookdata, setguestbookdata] = React.useState(null);
  const [guestbookerrors, setguestbookerrors] = React.useState(null);

  function getdate() {
    console.log(new Date().toISOString().toLocaleString().slice(0, 10));
    setdate(new Date().toISOString().toLocaleString().slice(0, 10));
  }
  const fetchguestbook = async () => {
    setloading(true);
    const { data, error } = await supabase.from("guestbook").select();
    if (error) {
      alert("error to fetch guestbook data");
      setguestbookerrors(error);
    }
    if (data) {
      setguestbookdata(data);
    }
  };
  React.useState(() => {
    fetchguestbook();
  }, []);
  // React.useState(() => {
  //   fetchguestbook();
  // }, [guestbookdata]);
  const uploaddata = async (e) => {
    let { data, error } = await supabase.from("guestbook").insert([
      {
        message,
        username,
        date: new Date().toISOString().toLocaleString().slice(0, 10),
      },
    ]);
    fetchguestbook();
  };
  const removedata = async (removeid) => {
    const { data } = await supabase
      .from("guestbook")
      .delete()
      .eq("id", removeid);
    fetchguestbook();
  };

  return (
    <Body title="GuestBook">
      <div className="mb-6">
        <h1 className="font-extrabold text-6xl tracking-tight">Guestbook</h1>
        <p className="text-md mt-1">
          Leave a message for me and other visitors here!
        </p>
        <h1>{signInWithGitHub}</h1>
      </div>
      {/* <div className="p-3 dark:bg-neutral-800 bg-neutral-200 drop-shadow-lg rounded-lg block mb-5">
        <div className="flex w-full">
          <Link href="/login">
            <button className="p-2 dark:bg-neutral-900 rounded-lg hover:drop-shadow-md duration-100 mt-3 bg-neutral-100">
              Login
            </button>
          </Link>
        </div>
      </div> */}
      <div className="p-3 dark:bg-neutral-800 bg-neutral-200 drop-shadow-lg rounded-lg block mb-5">
        <div className="flex">
          <input
            ref={messageinput}
            onFocus={() => setmessagenull(false)}
            onChange={(x) => setmessage(x.target.value)}
            placeholder="Your message..."
            type="text"
            className="px-2 w-full text-lg rounded-lg h-10 dark:bg-neutral-900 bg-neutral-100"
          ></input>
          <button
            onClick={() => {
              !message ? setmessagenull(true) : setmessagenull(false);
              getdate();
              message && uploaddata();
              messageinput.current.value = "";
              setmessage(null);
              // getServerSideProps();
            }}
            className="py-2 dark:bg-neutral-900 h-10 rounded-lg w-[140px] ml-2 hover:drop-shadow-md duration-100 bg-neutral-100"
          >
            Send It
          </button>
        </div>
        <p
          className={`text-red-600 text-md font-bold  ${
            messagenull ? (!message ? "block" : "hidden") : "hidden"
          }`}
        >
          Message is empty
        </p>
      </div>
      <ul className="">
        {guestbookdata &&
          guestbookdata
            .sort((a, b) => (a.id < b.id ? 1 : -1))
            .map((guestbook) => (
              <li
                key={guestbook.id}
                className="hover:bg-neutral-200 hover:dark:bg-neutral-800 hover:drop-shadow-lg duration-100 rounded-lg p-3 my-2"
              >
                <p className="">{guestbook.message}</p>
                <div className="flex dark:text-zinc-500 text-zinc-400">
                  <p className="text-zinc-600 ">{guestbook.username}</p>
                  <p className="mx-1 text-zinc-300 dark:text-neutral-700">/</p>
                  <p>{guestbook.date}</p>
                  <p className="mx-1 text-zinc-300 dark:text-neutral-700">/</p>
                  <button
                    className="text-red-600 hover:text-red-500 duration-100"
                    onClick={() => {
                      removedata(guestbook.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
      </ul>
    </Body>
  );
}
// export async function getServerSideProps() {
//   let { data } = await supabase.from("guestbook").select();
//   return {
//     props: {
//       guestbook: data,
//     },
//   };
// }

export default GuestBookPage;
