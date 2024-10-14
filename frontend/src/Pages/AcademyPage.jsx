import React from "react";
import AcademyNewsPage from "./AcademyNewsPage";
import AcademyPlayerPage from "./AcademyPlayerPage";
import "./AcademyPage.css";
import academy from "../academy/IMG-20240905-WA0011.jpg";

function AcademyPage() {
  return (
    <div className="academy-page">
      <h2 className="about-subtitle">KISIMA FC ACADEMY</h2>
      <p className="about-text">
        Kisima FC Academy was established in 2023 to nurture young football
        talent and provide a pathway for future professional players. The
        academy focuses on developing players from a young age, offering
        structured training programs and competitive matches to help them grow
        both technically and personally.
      </p>

      <div className="academy-info">
        <div className="pic-div">
          <img src={academy} className="academy-pic" alt="academy" />
          <p className="paragraph">The team's academy at a training session</p>
        </div>

        <div className="academy-details">
          <div className="academy-team-info">
            <h2 className="about-subtitle">Academy Categories</h2>
            <ul className="about-list">
              <li>
                <strong>U-10:</strong> For players aged 10 and under.
              </li>
              <li>
                <strong>U-13:</strong> For players aged 11 to 13.
              </li>
              <li>
                <strong>U-15:</strong> For players aged 14 and 15.
              </li>
              <li>
                <strong>U-17:</strong> For players aged 16 and 17.
              </li>
            </ul>

            <h2 className="about-subtitle">Team Details</h2>
            <ul className="about-list">
              <li>
                <strong>Coach:</strong> Pele Makana
              </li>
              <li>
                <strong>Assistant Coach:</strong> Gregory Olasia
              </li>
              <li>
                <strong>Team Captain:</strong> Stanley Chege
              </li>
              <li>
                <strong>Assistant Captain:</strong> Dalmas Otieno
              </li>
              <li>
                <strong>Team Formation:</strong> 4-3-3
              </li>
              <li>
                <strong>Home Ground:</strong> MAHIGA PRIMARY
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="academy-content">
        <div className="academy-news">
          <AcademyNewsPage />
        </div>
        <div className="academy-players">
          <AcademyPlayerPage />
        </div>
      </div>
    </div>
  );
}

export default AcademyPage;
