import { useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { checkExistByPIN } from "util/APIUtils";

PinWithURL.propTypes = {};

function PinWithURL(props) {
  let { pinCode } = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  useEffect(() => {
    console.log(match);
    if (pinCode) {
      checkExistByPIN(pinCode)
        .then((res) => {
          let myRootPath = match.url.substr(0, match.url.indexOf("/pin"));

          console.log(myRootPath);
          history.push(`${myRootPath}/name`, {
            rootPath: myRootPath,
            pin: pinCode,
          });
        })
        .catch((error) => {
          alert("An error has occurred!");
        });
    }
  }, [pinCode]);

  return <></>;
}

export default PinWithURL;
