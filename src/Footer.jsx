import "./App.css";
import Github from "./assets/github_white.svg";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer>
        <div className="footer-container">
          <a href="https://github.com/tkonzok">
            <img src={Github} alt="Github Icon" /> Developed by Tobias Konzok
          </a>
          <p>© {currentYear} Tobias Konzok</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
