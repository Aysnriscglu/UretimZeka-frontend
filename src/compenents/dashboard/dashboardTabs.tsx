import { Box } from "@mui/material";

import kaizenLogo from "../../assets/tabs/suggestion.png";
import fiveSLogo from "../../assets/tabs/fiveS.png";
import suggestionLogo from "../../assets/tabs/kaizen.png";

export type TabType = "kaizen" | "5s" | "suggestion";

type DashboardTabsProps = {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
};

const tabs = [
  {
    id: "kaizen" as const,
    image: kaizenLogo,
  },
  {
    id: "5s" as const,
    image: fiveSLogo,
  },
  {
    id: "suggestion" as const,
    image: suggestionLogo,
  },
];

export default function DashboardTabs({
  activeTab,
  setActiveTab,
}: DashboardTabsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3,1fr)",
        },
        gap: 2,
        mb: 4,
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <Box
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              height: 200,
              borderRadius: "28px",
              overflow: "hidden",
              cursor: "pointer",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              background: active
                ? "linear-gradient(180deg,#1B3B66,#102033)"
                : "#162334",

              border: active
                ? "2px solid #3B82F6"
                : "1px solid rgba(255,255,255,.08)",

              transition: "all .35s ease",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 25px 50px rgba(0,120,255,.35)",
                borderColor: "#60A5FA",
              },

              "& .tab-image": {
                transition: "transform .35s ease",
              },

              "&:hover .tab-image": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              component="img"
              className="tab-image"
              src={tab.image}
              alt={tab.id}
              sx={{
                width: "94%",
                height: "94%",
                objectFit: "contain",

                transform: "translateY(12px)",
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}