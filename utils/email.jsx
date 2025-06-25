 export const handleEmail = () => {
    const email = "Sija@smkn1-cmi.sch.id";
    const subject = encodeURIComponent("Pesan untuk Sija");
    const body = encodeURIComponent(
      "Halo, saya tertarik dengan sija, bisakah kita membicarakan lebih lanjut?"
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };
