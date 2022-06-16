import { generateBase64Hash, resolveBase64Hash, generateContentId } from "@/Hashes";

// ------------------------
// Hashes
// ------------------------
test("Tests base64 hash exchange", () => {
    expect(generateBase64Hash("MOROTEREHAI")).toBe("TU9ST1RFUkVIQUk=");
    expect(resolveBase64Hash("TU9ST1RFUkVIQUk=")).toBe("MOROTEREHAI");

    const bob = { name: "Bob", alignment: "Chaotic Evil", signia: "€" };
    const blob = generateBase64Hash(bob);
    const dataString = resolveBase64Hash(blob);
    const data = JSON.parse(dataString);
    expect(data.name).toBe("Bob");
});

test("Tests contentId generator", () => {
    const a = {
        stars_stars: 4.2,
        date_text: "2019-12-26",
        reviewContent_text:
            "I brought the phone last week after seeing good reviews about it. Everything works just like they said. The only problem I have is with my Tend Security Cameras. I can hear but no picture. After checking around, I think the problem is with Android 10 not the phone. Swann security cameras had to do a update to their app and now it works with Android 10. Still, I would highly recommend the OnePlus 7T to anyone.",
        reviewerName_text: "Lugoton",
    };
    const b = {
        stars_stars: 4.2,
        date_text: "2019-12-26",
        reviewContent_text:
            "I brought the phone last week after seeing good reviews about it. Everything works just like they said. The only problem I have is with my Tend Security Cameras. I can hear but no picture. After checking around, I think the problem is with Android 10 not the phone. Swann security cameras had to do a update to their app and now it works with Android 10. Still, I would highly recommend the OnePlus 7T to anyone.",
        reviewerName_text: "Lugoton",
    };
    const c = {
        stars_stars: 4.22,
        date_text: "2019-12-26",
        reviewContent_text:
            "I brought the phone last week after seeing good reviews about it. Everything works just like they said. The only problem I have is with my Tend Security Cameras. I can hear but no picture. After checking around, I think the problem is with Android 10 not the phone. Swann security cameras had to do a update to their app and now it works with Android 10. Still, I would highly recommend the OnePlus 7T to anyone.",
        reviewerName_text: "Lugoton",
    };

    const contentIdA = generateContentId(a);
    const contentIdB = generateContentId(b);
    const contentIdC = generateContentId(c);

    expect(contentIdA).toBe(generateContentId(a));
    expect(contentIdA).toBe("1c297e22e800bc4c873222f8f2a8748d");
    expect(contentIdA).toBe(contentIdB);
    expect(contentIdA).not.toBe(contentIdC);
});
