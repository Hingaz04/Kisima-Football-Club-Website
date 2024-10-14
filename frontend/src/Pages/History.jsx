import React from "react";
import "./History.css";
import founders from "../assets/IMG_20240903_174807_506.jpg";
import founders2 from "../assets/IMG_20240903_174757_328.jpg";
import firstYouthTeam from "../assets/IMG-20201125-WA0002.jpg";
import youthTeam from "../assets/IMG_20240903_174714_393.jpg";
import countyTeam from "../assets/IMG-20230810-WA0012.jpg";
import season2 from "../assets/IKR_6003.jpg";
import subcountyTeam from "../assets/IMG-20201130-WA0011.jpg";
import academy from "../academy/IMG-20240905-WA0011.jpg";

function History() {
  return (
    <div className="history-container">
      <div className="history">
        <h1 className="history-title">KISIMA FC ARCHIVES</h1>
        <h2 className="history-subtitle">A Journey of Passion and Progress</h2>
        <p className="history-text">
          Kisima FC was founded in 2011 with humble beginnings. Originally
          formed by a small group of older, retired football enthusiasts, the
          team initially played for the love of the game, without the pressures
          of competition. These early members, many of whom had hung up their
          boots after years of playing, rekindled their passion for the sport,
          enjoying regular matches purely for fun and camaraderie.
        </p>
        <img src={founders} alt="team founders" />
        <p className="paragraph">The original founder members of the team</p>

        <p className="history-text">
          Word about the team started to spread, attracting more players and
          creating a vibrant community of football lovers. Soon, the focus began
          to shift towards creating a more competitive environment, and the team
          started to evolve beyond just a recreational outfit.
        </p>
        <img src={founders2} alt="team founders" />
        <p className="paragraph">At an away game</p>

        <p className="history-text">
          Recognizing the potential in the younger generation, Kisima FC
          expanded by introducing a youth team. This was a turning point for the
          club, as it began transitioning from a group of veterans to a blend of
          experience and youthful enthusiasm.
        </p>
        <img src={firstYouthTeam} alt="first youth team" />
        <p className="paragraph">
          Some of the first youth to be integrated into the team
        </p>
        <img src={youthTeam} alt="youth team" />
        <p className="paragraph">The team's fisrt youth team</p>

        <p className="history-text">
          By 2021, Kisima FC was ready to take on competitive football, joining
          the subcounty league in Nairobi. Despite their relatively late entry
          into structured competition, the team performed impressively. Their
          hard work and determination paid off after just one season, when they
          earned promotion to the county level.
        </p>
        <img src={subcountyTeam} alt="subcounty" />
        <p className="paragraph">The team's first subcounty season</p>

        <p className="history-text">
          With their promotion, Kisima FC began competing at a higher level,
          sharpening their skills and proving themselves as formidable
          opponents. The transition from the subcounty to county level was a
          significant milestone for the club, and their growth both on and off
          the field continued.
        </p>
        <img src={countyTeam} alt="county team" />
        <p className="paragraph">The team's first county season</p>

        <p className="history-text">
          Kisima FC’s home ground, Mahiga Primary, became a symbol of their
          community roots, where young and experienced players came together in
          pursuit of football excellence. The team grew from strength to
          strength, solidifying their reputation in Nairobi's football scene.
        </p>
        <img src={season2} alt="season2" />
        <p className="paragraph">The team's second county season</p>

        <h2 className="history-subtitle">The Kisima FC Academy</h2>
        <p className="history-text">
          In 2023, Kisima FC launched the Kisima FC Academy, a critical step in
          their long-term vision of developing young talent. The academy focuses
          on training players aged 10 to 17, with teams divided into U-10, U-13,
          U-15, and U-17 categories. The academy has since become a breeding
          ground for future stars, with a focus on both skill development and
          character building.
          <img src={academy} alt="academy" />
          <p className="paragraph">The team's academy at a training session</p>
        </p>

        <p className="history-text">
          The Kisima FC Academy represents the club’s commitment to creating a
          sustainable future by investing in young footballers and ensuring they
          have the best possible chance to succeed, both on and off the field.
          The academy has quickly established itself as a vital part of Kisima
          FC’s long-term success, providing the foundation for future
          competitive seasons.
        </p>

        <p className="history-text">
          Today, Kisima FC stands as a beacon of passion, growth, and dedication
          to the sport. The team continues to compete at the county level while
          grooming future generations through the academy. The journey from a
          small group of retirees playing for fun to a competitive force in
          local football highlights the club’s perseverance and commitment to
          nurturing talent and fostering community spirit.
        </p>
      </div>
    </div>
  );
}

export default History;
