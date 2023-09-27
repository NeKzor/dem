import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "In-depth",
    description: (
      <>
        In-depth documentation for all embedded types.
      </>
    ),
  },
  {
    title: "Type Definitions",
    description: (
      <>
        Type definitions for C, C++, C#, JS, TS, Go, Rust and Zig.
      </>
    ),
  },
  {
    title: "Examples",
    description: (
      <>
        Pseudocode examples when parsing advanced data.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => <Feature key={idx} {...props} />)}
        </div>
      </div>
    </section>
  );
}
