import Icon from "@mdi/react";
import { mdiStar } from "@mdi/js";
import classNames from "classnames";
import "./Rating.css";

function Rating({rating, maxRating, size=1}){
    return (
        <div className="rating">
          {new Array(maxRating).fill(0).map((_, index) => {
            const isActive = rating >= index + 1;
            return (
              <Icon
                key={index}
                className={classNames("rating__star", {
                  "rating__star--active": isActive
                })}
                size={size}
                path={mdiStar}
              />
            );
          })}{" "}
        </div>
      );
}

export default Rating;