import { useEffect, useState } from "react";

function GuidedTour() {
  const [step, setStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  const tourSteps = [
    {
      title: "Welcome to Book Catalog!",
      description: "This is your personal space to explore and manage books.",
    },
    {
      title: "Search Books",
      description: "Use the search bar to find books by title or author.",
    },
    {
      title: "Add New Books",
      description: "Click Add New Book to add a book to the catalog.",
    },
    {
      title: "Edit Books",
      description: "Use the Edit button to update a book's information.",
    },
    {
      title: "Delete Books",
      description: "Use the Delete button to remove a book from the catalog.",
    },
  ];

  useEffect(() => {
    const tourCompleted = localStorage.getItem("bookTourCompleted");

    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

  function finishTour() {
    localStorage.setItem("bookTourCompleted", "true");
    setShowTour(false);
  }

  function nextStep() {
    if (step === tourSteps.length - 1) {
      finishTour();
    } else {
      setStep(step + 1);
    }
  }

  if (!showTour) {
    return null;
  }

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <h2>{tourSteps[step].title}</h2>

        <p>{tourSteps[step].description}</p>

        <span>
          Step {step + 1} of {tourSteps.length}
        </span>

        <div className="tour-buttons">
          <button onClick={finishTour}>Skip Tour</button>

          <button onClick={nextStep}>
            {step === tourSteps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuidedTour;
