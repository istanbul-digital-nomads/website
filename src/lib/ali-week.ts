// Ali Sameni's showcase week - 7 day plans (Mon June 1 - Sun June 7, 2026),
// one per day, cycling through Kadıköy / Şişli / Beyoğlu. Each day starts at a
// real, cited coffee branch (coordinates come from public/data/brand-locations.json
// which we built from the official store locators + OSM). Other stops are
// well-known Istanbul public landmarks. Powers the animated viewer at /plans/ali-week.

export type AliNeighborhood = "Kadıköy" | "Şişli" | "Beyoğlu";

export interface AliStop {
  id: string;
  time: string;
  title: string;
  note: string;
  lng: number;
  lat: number;
}

export interface AliDayPlan {
  day: number; // 1..7
  date: string; // ISO yyyy-mm-dd
  weekday: string; // Mon..Sun
  neighborhood: AliNeighborhood;
  title: string;
  blurb: string;
  stops: AliStop[];
}

export const aliMember = {
  name: "Ali Sameni",
  handle: "ali-sameni",
  bio: "Designer, walking nomad. Splits the week between Kadıköy, Şişli, and Beyoğlu - one neighborhood a day.",
};

export const aliWeek: AliDayPlan[] = [
  {
    day: 1,
    date: "2026-06-01",
    weekday: "Mon",
    neighborhood: "Kadıköy",
    title: "Moda slow morning",
    blurb:
      "Open the week soft. Coffee in Caferağa, a walk to the water, lunch at Çiya, and the evening in Bahariye.",
    stops: [
      {
        id: "mon-1",
        time: "09:00 – 11:30",
        title: "BEX Coffee Caferağa",
        note: "Slow start with a flat white and a stack of unread messages.",
        lng: 29.0263,
        lat: 40.9897,
      },
      {
        id: "mon-2",
        time: "12:00 – 13:30",
        title: "Moda Sahili",
        note: "Stretch the legs along the sea before lunch.",
        lng: 29.0277,
        lat: 40.9819,
      },
      {
        id: "mon-3",
        time: "13:45 – 15:00",
        title: "Çiya Sofrası",
        note: "Anatolian comfort food at the Kadıköy market.",
        lng: 29.0276,
        lat: 40.9886,
      },
      {
        id: "mon-4",
        time: "17:00 – 19:00",
        title: "Süreyya Opera & Bahariye",
        note: "Wander Bahariye, peek at Süreyya, end the day light.",
        lng: 29.0282,
        lat: 40.9905,
      },
    ],
  },
  {
    day: 2,
    date: "2026-06-02",
    weekday: "Tue",
    neighborhood: "Şişli",
    title: "Nişantaşı deep work",
    blurb:
      "Heads-down day in Nişantaşı. Long focus block, lunch around the corner, a green walk through Maçka, dinner at Bomonti.",
    stops: [
      {
        id: "tue-1",
        time: "09:00 – 12:30",
        title: "Kahve Dünyası Nişantaşı",
        note: "Long focus block. Big windows, steady wifi.",
        lng: 28.9925,
        lat: 41.0518,
      },
      {
        id: "tue-2",
        time: "13:00 – 14:00",
        title: "Lunch on Vali Konağı",
        note: "Quick lunch nearby, then keep moving.",
        lng: 28.9919,
        lat: 41.0515,
      },
      {
        id: "tue-3",
        time: "15:00 – 17:00",
        title: "Maçka Demokrasi Park",
        note: "Walk through the park toward the Bosphorus side.",
        lng: 28.9925,
        lat: 41.0466,
      },
      {
        id: "tue-4",
        time: "18:00 – 21:00",
        title: "BomontiAda",
        note: "Drinks and food in the old brewery courtyard.",
        lng: 28.9837,
        lat: 41.0617,
      },
    ],
  },
  {
    day: 3,
    date: "2026-06-03",
    weekday: "Wed",
    neighborhood: "Beyoğlu",
    title: "Karaköy & Galata loop",
    blurb:
      "Start by the water in Karaköy, climb to Galata, then drift up İstiklal once the light goes warm.",
    stops: [
      {
        id: "wed-1",
        time: "09:30 – 12:00",
        title: "Mikel Coffee Karaköy",
        note: "Open near the water while it's still cool.",
        lng: 28.977,
        lat: 41.0236,
      },
      {
        id: "wed-2",
        time: "12:30 – 14:00",
        title: "Karaköy lunch",
        note: "Old-school meyhane fare by the pier.",
        lng: 28.9786,
        lat: 41.0247,
      },
      {
        id: "wed-3",
        time: "14:30 – 16:00",
        title: "Galata Tower & alleys",
        note: "Climb to the tower, then through Galata's slope.",
        lng: 28.9744,
        lat: 41.0257,
      },
      {
        id: "wed-4",
        time: "17:00 – 20:00",
        title: "İstiklal Caddesi",
        note: "Down İstiklal in the warm light, end at Tünel.",
        lng: 28.9777,
        lat: 41.0345,
      },
    ],
  },
  {
    day: 4,
    date: "2026-06-04",
    weekday: "Thu",
    neighborhood: "Kadıköy",
    title: "Bağdat Caddesi day",
    blurb:
      "Open the day on the strip. Work block, lunch on Bağdat, an easy shop walk, then the sunset at Caddebostan.",
    stops: [
      {
        id: "thu-1",
        time: "09:00 – 12:00",
        title: "Caffè Nero Caddebostan",
        note: "Work block on the strip.",
        lng: 29.0561,
        lat: 40.9733,
      },
      {
        id: "thu-2",
        time: "12:30 – 13:30",
        title: "Lunch on Bağdat Cad",
        note: "Quick bite between shop windows.",
        lng: 29.064,
        lat: 40.971,
      },
      {
        id: "thu-3",
        time: "14:00 – 16:00",
        title: "Suadiye shop walk",
        note: "Easy pace through Suadiye toward Bostancı.",
        lng: 29.07,
        lat: 40.9692,
      },
      {
        id: "thu-4",
        time: "17:00 – 19:00",
        title: "Caddebostan Sahili sunset",
        note: "Sit on the rocks for the sunset over the Marmara.",
        lng: 29.0623,
        lat: 40.9683,
      },
    ],
  },
  {
    day: 5,
    date: "2026-06-05",
    weekday: "Fri",
    neighborhood: "Şişli",
    title: "Mecidiyeköy + Bomonti",
    blurb:
      "Fulya morning at BEX, a quick mall stop, an afternoon in the Bomonti courtyard, dinner up by Maçka.",
    stops: [
      {
        id: "fri-1",
        time: "09:30 – 12:30",
        title: "BEX Coffee Fulya",
        note: "New BEX in Fulya, plenty of sockets.",
        lng: 28.9934,
        lat: 41.0642,
      },
      {
        id: "fri-2",
        time: "13:00 – 14:30",
        title: "Cevahir lunch",
        note: "Quick stop at the mall, just refuel.",
        lng: 28.9912,
        lat: 41.0653,
      },
      {
        id: "fri-3",
        time: "15:30 – 18:00",
        title: "BomontiAda afternoon",
        note: "Coffee in the courtyard, watch the kids play.",
        lng: 28.9837,
        lat: 41.0617,
      },
      {
        id: "fri-4",
        time: "19:00 – 22:00",
        title: "Maçka evening",
        note: "Sunset through the park, dinner up in Nişantaşı.",
        lng: 28.9925,
        lat: 41.0466,
      },
    ],
  },
  {
    day: 6,
    date: "2026-06-06",
    weekday: "Sat",
    neighborhood: "Beyoğlu",
    title: "İstiklal social",
    blurb:
      "Late brunch at Taksim, down İstiklal in the afternoon, coffee in Cihangir, meyhane night in Asmalı Mescit.",
    stops: [
      {
        id: "sat-1",
        time: "10:00 – 12:00",
        title: "Starbucks Taksim (Marmara)",
        note: "Saturday brunch start.",
        lng: 28.986,
        lat: 41.0367,
      },
      {
        id: "sat-2",
        time: "12:30 – 14:30",
        title: "Walk down İstiklal",
        note: "Down İstiklal toward Galatasaray, slow.",
        lng: 28.9777,
        lat: 41.0345,
      },
      {
        id: "sat-3",
        time: "15:00 – 17:30",
        title: "Cihangir streets",
        note: "Coffee and bookstores in Cihangir.",
        lng: 28.9809,
        lat: 41.0337,
      },
      {
        id: "sat-4",
        time: "19:00 – 22:30",
        title: "Asmalı Mescit dinner",
        note: "Meyhane evening with friends.",
        lng: 28.9758,
        lat: 41.0309,
      },
    ],
  },
  {
    day: 7,
    date: "2026-06-07",
    weekday: "Sun",
    neighborhood: "Kadıköy",
    title: "Moda easy Sunday",
    blurb:
      "Late breakfast in Moda, a slow brunch, a long walk down the sahil, easy dinner by Süreyya.",
    stops: [
      {
        id: "sun-1",
        time: "10:00 – 12:00",
        title: "Kahve Dünyası Moda",
        note: "Late breakfast, no rush.",
        lng: 29.0249,
        lat: 40.9909,
      },
      {
        id: "sun-2",
        time: "12:30 – 14:00",
        title: "Brunch in Moda",
        note: "Slow brunch on the Moda streets.",
        lng: 29.0275,
        lat: 40.987,
      },
      {
        id: "sun-3",
        time: "15:00 – 18:00",
        title: "Moda Sahili long walk",
        note: "Walk south toward the Caddebostan side, with breaks.",
        lng: 29.0277,
        lat: 40.9819,
      },
      {
        id: "sun-4",
        time: "19:00 – 21:00",
        title: "Süreyya wrap-up",
        note: "Wrap the week with an easy dinner near the opera.",
        lng: 29.0282,
        lat: 40.9905,
      },
    ],
  },
];
