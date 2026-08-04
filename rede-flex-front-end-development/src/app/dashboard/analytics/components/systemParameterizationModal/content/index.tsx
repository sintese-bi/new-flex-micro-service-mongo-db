import CircularLoading from "@/components/loading/circularLoading";
import { useContext } from "react";
import { SystemParameterizationModalContext } from "../context";
import CurrentSecondarySectionSelector from "./currentSecondarySectionSelector";
import CurrentSectionSelector from "./currentSectionSelector";
import { sectionsFields } from "./fields";
import FormRede from "./form_rede";
import FormsTableConfiguration from "./forms_table";
import GeneralForm from "./forms_table/generalForm";
export default function SystemParameterizationModalContent() {
  const {
    data,
    generalData,
    currentSection,
    currentSecondarySection,
    handleData,
    setCurrentSection,
    setCurrentSecondarySection,
  } = useContext(SystemParameterizationModalContext)!;
  if (!data)
    return (
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <div>
          <p>Gentileza aguarde!</p>
          <p>Essa ação pode demorar um pouco</p>
        </div>

        <CircularLoading />
      </div>
    );
  return (
    <>
      <div>
        <CurrentSectionSelector
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
        <CurrentSecondarySectionSelector
          currentSection={currentSection}
          currentSecondarySection={currentSecondarySection}
          setCurrentSecondarySection={setCurrentSecondarySection}
        />
      </div>
      <GeneralForm />
      <div className="w-full max-h-[400px] z-100">
        {currentSection == 0 ? (
          <FormRede
            data={data}
            fields={sectionsFields[currentSection]}
            currentSection={currentSection}
            currentSecondarySection={currentSecondarySection}
          />
        ) : (
          <FormsTableConfiguration
            data={data}
            fields={sectionsFields[currentSection]}
          />
        )}
      </div>
    </>
  );
}
