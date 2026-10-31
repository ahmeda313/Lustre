export const contact = {
  phone: "+91 79750 52435",
  phoneHref: "+917975052435",
  whatsapp: "917975052435",
  email: "rayan@lustre.in",
  city: "Bengaluru",
  region: "Karnataka",
  country: "IN",
  hours: [
    { days: "Monday — Friday", time: "7:00 am — 7:00 pm" },
    { days: "Saturday — Sunday", time: "8:00 am — 6:00 pm" },
  ],
  openingHoursSpecification: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "19:00",
    },
    { days: ["Saturday", "Sunday"], opens: "08:00", closes: "18:00" },
  ],
  areas: [
    "Indiranagar",
    "Koramangala",
    "HSR Layout",
    "Jayanagar",
    "Sadashivanagar",
    "Malleshwaram",
    "Whitefield",
    "Hebbal",
  ],
  areaNote: "Bengaluru, inside the Outer Ring Road and selected neighbourhoods beyond it.",
  responseNote: "We reply on WhatsApp within one working hour.",
} as const;
