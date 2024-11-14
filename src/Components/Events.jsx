import React, { useEffect, useState } from "react";

const Events = () => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentMonth_date, setCurrentMonth_date] = useState(0);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  
  const eventsPerPage = window.innerWidth < 400 ? 6 : 10
  
  const getMonthName = (monthNumber) => {
    const date = new Date(2024, monthNumber );
    return date.toLocaleString("hu-HU", { month: "long" }).toLocaleUpperCase();
  };

  useEffect(() => {
    fetch("./data/events.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hiba a JSON fájl lekérésekor.");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data.esemenyek);
        setCurrentMonth_date(data.honap);
        setCurrentMonth(getMonthName(data.honap-1))
      })
      .catch((error) => {
        console.error("Hiba történt a lekérés során:", error);
      });
  }, []);

  useEffect(() => {
    const date = new Date();
    const monthName = date.toLocaleString("default", { month: "long" });
    setCurrentMonth(monthName);
  }, []);

  const lastEventIndex = currentPage * eventsPerPage;
  const firstEventIndex = lastEventIndex - eventsPerPage;
  const currentEvents = events.slice(firstEventIndex, lastEventIndex);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

  },[currentMonth_date])



  return (
    <div>
      <div className="lg:mt-12 mt-5">
        <h1 className="pt-3 lg:text-5xl md:text-4xl text-3xl font-bold">
          {currentMonth}
        </h1>
      </div>
      <div
        id="event_container"
        className="flex flex-col mt-14 lg:pt-3 md:text-xl text-sm m-auto text-center gap-2 px-2 lg:min-h-[23rem] md:min-h-[22rem] min-h-[17rem] w-fit"
      >
        {currentEvents.map((event, index) => (
          <div
            key={index}
            className="flex hover:text-slate-400 active:text-slate-700"
          >
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              {currentMonth_date}.{event.nap}. / {event.helyszin} /{" "}
              {event.bulinev} / {event.varos}
            </a>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-3 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-1 rounded transition-all active:rounded-3xl ${
                currentPage === index + 1
                  ? "bg-white text-black px-6"
                  : "bg-slate-700 text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
