/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef, createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";
import MKPaginationItemRoot from "components/MKPagination/MKPaginationItemRoot";

const Context = createContext();

const MKPagination = forwardRef(
  (
    {
      item = false,
      variant = "gradient",
      color = "info",
      size = "medium",
      active = false,
      children,
      placement = "right",
      ...rest
    },
    ref
  ) => {
    // Always call hook at top level
    const context = useContext(Context);
    const paginationSize = context ? context.size : null;
    const paginationProps = useMemo(
      () => ({ variant, color, size }),
      [variant, color, size]
    );

    let placementValue = "flex-end";
    if (placement === "left") {
      placementValue = "flex-start";
    } else if (placement === "center") {
      placementValue = "center";
    }

    return (
      <Context.Provider value={paginationProps}>
        {item ? (
          <MKPaginationItemRoot
            {...rest}
            ref={ref}
            variant={active ? paginationProps.variant : "outlined"}
            color={active ? paginationProps.color : "secondary"}
            iconOnly
            circular
            ownerState={{ variant, active, paginationSize }}
          >
            {children}
          </MKPaginationItemRoot>
        ) : (
          <MKBox
            display="flex"
            justifyContent={placementValue}
            alignItems="center"
            sx={{ listStyle: "none" }}
            {...rest}
            ref={ref}
          >
            {children}
          </MKBox>
        )}
      </Context.Provider>
    );
  }
);

MKPagination.propTypes = {
  item: PropTypes.bool,
  variant: PropTypes.oneOf(["gradient", "contained"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(["left", "right", "center"]),
};

export default MKPagination;