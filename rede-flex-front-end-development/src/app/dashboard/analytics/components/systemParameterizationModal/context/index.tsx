import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  handleGeneralTMSAndBruteProfitPerRegional,
  handleGeneralTMSAndBruteProfitPerStation,
  handleTMsAndBruteProfit,
  handleTMsAndBruteProfitPerRegional,
  handleTMsAndBruteProfitPerStation,
} from "../../../actions";
export interface ContextProps {
  data: any;
  generalData: any;
  currentSection: 0 | 1 | 2;
  currentSecondarySection: 0 | 1 | 2 | 3;
  handleData: (section: 0 | 1 | 2) => Promise<void>;
  setCurrentSection: Dispatch<SetStateAction<0 | 1 | 2>>;
  setCurrentSecondarySection: Dispatch<SetStateAction<0 | 1 | 2 | 3>>;
}
export const SystemParameterizationModalContext =
  createContext<ContextProps | null>(null);
export const SystemParameterizationModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<any>(null);
  const [generalData, setGeneralData] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<0 | 1 | 2>(0);
  const [currentSecondarySection, setCurrentSecondarySection] = useState<
    0 | 1 | 2 | 3
  >(0);
  async function handleData(section: 0 | 1 | 2) {
    const handleSectionsFunctions = {
      0: handleTMsAndBruteProfit,
      1: handleTMsAndBruteProfitPerStation,
      2: handleTMsAndBruteProfitPerRegional,
    };
    const { data } = await handleSectionsFunctions[section]();
    setData(data);
  }
  async function handleGeneralData(section: 0 | 1 | 2) {
    const handleSectionsFunctions = {
      0: () => {
        return { data: [] };
      },
      1: handleGeneralTMSAndBruteProfitPerStation,
      2: handleGeneralTMSAndBruteProfitPerRegional,
    };
    const { data } = await handleSectionsFunctions[section]();
    setGeneralData(data);
  }
  useEffect(() => {
    setCurrentSecondarySection(0);
    setData(null);
    handleData(currentSection);
    handleGeneralData(currentSection);
    return () => {
      setData(null);
    };
  }, [currentSection]);
  return (
    <SystemParameterizationModalContext.Provider
      value={{
        data,
        generalData,
        currentSection,
        currentSecondarySection,
        handleData,
        setCurrentSection,
        setCurrentSecondarySection,
      }}
    >
      {children}
    </SystemParameterizationModalContext.Provider>
  );
};
