import * as React from "react";
import { ITopNavItem } from "@conduction/components/lib/components/topNav/primaryTopNav/PrimaryTopNav";
import { useGatsbyContext } from "../context/gatsby";
import { navigate } from "gatsby";
import { useTranslation } from "react-i18next";
import { useHeaderContent } from "./headerContent";

export type THeaderTopNavItem = {
  label: string;
  type: "markdown" | "internal" | "external";
  current: {
    pathname: string;
    filterCondition?: {
      filterKey: string;
      value: string;
    };
  };
  icon?: JSX.Element;
  showToolTip?: boolean;
  handleClick?: {
    link: string;
  };
};

export const useHeaderTopNavItems = (optionalData?: THeaderTopNavItem[]) => {
  const { t } = useTranslation();
  const { gatsbyContext } = useGatsbyContext();
  const [topNavItems, setTopNavItems] = React.useState<ITopNavItem[]>([]);

  // For production
  const _useHeaderContent = useHeaderContent();
  const getHeaderContent = _useHeaderContent.getContent();
  getHeaderContent.isSuccess && getHeaderContent.data.concat(optionalData);

  // For development
  // const getHeaderContent = {data: require("../templates/templateParts/header/HeaderContent.json")};

  React.useEffect(() => {
    if (!getHeaderContent.data) return;

    const headerTopNavItems = [...getHeaderContent.data, ...(optionalData ?? [])].map((item: any) => {
      const isCurrent = (current: any) => {
        const prefixedPathname =
          process.env.GATSBY_USE_GITHUB_REPOSITORY_NAME_AS_PATH_PREFIX === "true"
            ? `/${process.env.GATSBY_GITHUB_REPOSITORY_NAME}${current.pathname}`
            : current.pathname;

        const isCurrentRoute = (): boolean => {
          if (prefixedPathname === gatsbyContext.location.pathname) return true;

          if (current.pathname !== "/") return gatsbyContext.location.pathname.includes(current.pathname);

          return false;
        };

        if (!current.filterCondition) {
          return isCurrentRoute();
        }
      };

      const getOnClick = (
        onClick: any,
        type: "markdown" | "readme" | "internal" | "external" | "internalMarkdown",
        label: string,
      ) => {
        if (!onClick || !type || !label) return;

        if (onClick.link && !onClick.setFilter) {
          if (type === "internal") {
            navigate(onClick.link);
          }

          if (type === "external") {
            open(onClick.link);
          }

          if (type === "markdown" || type === "readme") {
            navigate(`/github/${label.replaceAll(" ", "_")}/?link=${onClick.link}`);
          }
        }

        if (!onClick.link && onClick.internalMarkdown) {
          if (type === "internalMarkdown") {
            navigate(`/pages/${onClick.internalMarkdown.directoryName}/${onClick.internalMarkdown.fileName}`);
          }
        }
      };

      const setSubItems = (subItems: ITopNavItem[]) => {
        if (!subItems) return;
        const subItemsArray: ITopNavItem[] = [];

        subItems.map((item: any) => {
          subItemsArray.push({
            label: t(item.label),
            type: item.type,
            current: item.current ? isCurrent(item.current) : false,
            handleClick: () => getOnClick(item.handleClick, item.type, item.label),
          });
        });

        const subItemsObject = Object.assign(subItemsArray);

        return subItemsObject;
      };

      return {
        label: t(item.label),
        type: item.type,
        icon: item.icon,
        current: item.current ? isCurrent(item.current) : false,
        handleClick: () => getOnClick(item.handleClick, item.type, item.label),
        subItems: setSubItems(item.subItems),
      };
    });

    setTopNavItems(headerTopNavItems);
  }, [getHeaderContent.data, gatsbyContext.location.pathname, gatsbyContext.pageContext?.breadcrumb.crumbs]);

  return { topNavItems };
};
