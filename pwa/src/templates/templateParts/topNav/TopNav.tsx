import * as React from "react";
import * as styles from "./TopNav.module.css";
import { UnorderedList, UnorderedListItem } from "@utrecht/component-library-react/dist/css-module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkSquare } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";
import { useGitHub } from "../../../hooks/resources/gitHub";
import { GitHubLogo } from "../../../assets/svgs/Github";
import { SlackLogo } from "../../../assets/svgs/Slack";
import { ToolTip } from "@conduction/components";
import { TGitHubDirectory, useGitHubDirectories } from "../../../hooks/useGitHubDirectories";

export const TopNav: React.FC = () => {
  const { directories, getSlugFromName } = useGitHubDirectories();

  return (
    <nav className={styles.container}>
      <UnorderedList className={styles.list}>
        <section>
          <UnorderedListItem onClick={() => navigate("/")}>Home</UnorderedListItem>

          {directories?.map((directory, idx) => (
            <UnorderedListItem key={idx} onClick={() => navigate(`/pages/${getSlugFromName(directory.name)}`)}>
              {directory.name}

              <FeaturesDropDown {...{ directory }} />
            </UnorderedListItem>
          ))}
        </section>

        <section>
          <UnorderedListItem onClick={() => open(window.sessionStorage.getItem("READ_THE_DOCS_URL") ?? "#")}>
            <FontAwesomeIcon icon={faExternalLinkSquare} /> Documentation
          </UnorderedListItem>

          <UnorderedListItem onClick={() => open(window.sessionStorage.getItem("SLACK_URL") ?? "#")}>
            <ToolTip tooltip="Slack">
              <SlackLogo />
            </ToolTip>
          </UnorderedListItem>

          <UnorderedListItem onClick={() => open(window.sessionStorage.getItem("GITHUB_REPOSITORY_URL") ?? "#")}>
            <ToolTip tooltip="Github">
              <GitHubLogo />
            </ToolTip>
          </UnorderedListItem>
        </section>
      </UnorderedList>
    </nav>
  );
};

interface FeaturesDropDownProps {
  directory: TGitHubDirectory;
}

const FeaturesDropDown: React.FC<FeaturesDropDownProps> = ({ directory }) => {
  const { getSlugFromName } = useGitHubDirectories();
  const getDetailPages = useGitHub().getDirectoryItems(directory.location);

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, target: string) => {
    e.stopPropagation();

    navigate(`/pages/${getSlugFromName(directory.name)}/${target}`);
  };

  return (
    <UnorderedList className={styles.dropDownList}>
      {getDetailPages.data
        ?.filter((detailPage) => detailPage.name !== "README")
        .map((detailPage, idx) => (
          <UnorderedListItem key={idx} onClick={(e) => handleClick(e, detailPage.href)}>
            {detailPage.name}
          </UnorderedListItem>
        ))}
    </UnorderedList>
  );
};
