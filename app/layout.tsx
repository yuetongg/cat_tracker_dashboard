import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import {
  MantineProvider,
  createTheme,
} from "@mantine/core";

const theme = createTheme({
  fontFamily:
    "Inter, Arial, sans-serif",

  headings: {
    fontFamily:
      "Inter, Arial, sans-serif",
    fontWeight: "800",
  },

  defaultRadius: "sm",

  components: {
    Card: {
      styles: {
        root: {
          border: "3px solid #111111",
          boxShadow: "5px 5px 0 #111111",
          backgroundColor: "#fffdf5",
        },
      },
    },

    Button: {
      styles: {
        root: {
          border: "2px solid #111111",
          boxShadow: "3px 3px 0 #111111",
          fontWeight: 700,
          transition:
            "transform 0.08s ease, box-shadow 0.08s ease",

          "&:hover": {
            transform:
              "translate(2px, 2px)",
            boxShadow:
              "1px 1px 0 #111111",
          },

          "&:active": {
            transform:
              "translate(3px, 3px)",
            boxShadow: "none",
          },
        },
      },
    },

    Select: {
      styles: {
        input: {
          border: "2px solid #111111",
          fontWeight: 600,
          backgroundColor: "#ffffff",
        },
      },
    },

    MultiSelect: {
      styles: {
        input: {
          border: "2px solid #111111",
          fontWeight: 600,
          backgroundColor: "#ffffff",
        },
      },
    },

    DatePickerInput: {
      styles: {
        input: {
          border: "2px solid #111111",
          fontWeight: 600,
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});

export const metadata = {
  title: "Cat Monitoring Dashboard",
  description:
    "Boon Lay cat monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      

      <body
        style={{
          margin: 0,
          backgroundColor: "#f6f1e8",
        }}
      >
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}