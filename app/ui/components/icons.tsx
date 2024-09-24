type IconProps = React.ComponentProps<"svg">

export const Icons = {
   logo: (props: IconProps) => (
      <svg
         viewBox="0 0 21 13"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         style={{
            filter: "drop-shadow(0px 3px 3px rgba(24, 24, 24, .25))",
         }}
         {...props}
      >
         <path
            d="M1 8.3333C1 8.3333 2.5 9 4.5 12C4.5 12 4.78485 11.5192 5.32133 10.7526M15 1C12.7085 2.14577 10.3119 4.55181 8.3879 6.8223"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M6 8.3333C6 8.3333 7.5 9 9.5 12C9.5 12 15 3.5 20 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   XMark: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M6 18L12 12M12 12L18 6M12 12L6 6M12 12L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   home: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M3 12.7587C3 11.7418 3 11.2334 3.11866 10.7571C3.22385 10.3349 3.39721 9.93275 3.63191 9.56641C3.89667 9.15313 4.26632 8.80402 5.00561 8.1058L7.60561 5.65025C9.15211 4.18966 9.92537 3.45937 10.8075 3.18385C11.584 2.94132 12.416 2.94132 13.1925 3.18385C14.0746 3.45937 14.8479 4.18966 16.3944 5.65025L18.9944 8.1058C19.7337 8.80402 20.1033 9.15313 20.3681 9.56641C20.6028 9.93275 20.7761 10.3349 20.8813 10.7571C21 11.2334 21 11.7418 21 12.7587V14.6C21 16.8402 21 17.9603 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C18.0128 20.9732 16.9767 20.9983 15 20.9999C13 21.0014 11 21.0014 9 20.9999C7.0233 20.9983 5.98717 20.9732 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43597 18.816C3 17.9603 3 16.8402 3 14.6V12.7587Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M15 20.9999V16C15 14.3431 13.6569 13 12 13C10.3431 13 9 14.3431 9 16V20.9999M15 20.9999C16.9767 20.9983 18.0128 20.9732 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C21 17.9603 21 16.8402 21 14.6V12.7587C21 11.7418 21 11.2334 20.8813 10.7571C20.7761 10.3349 20.6028 9.93275 20.3681 9.56641C20.1033 9.15313 19.7337 8.80402 18.9944 8.1058L16.3944 5.65025C14.8479 4.18966 14.0746 3.45937 13.1925 3.18385C12.416 2.94132 11.584 2.94132 10.8075 3.18385C9.92537 3.45937 9.15211 4.18966 7.60561 5.65025L5.00561 8.1058C4.26632 8.80402 3.89667 9.15313 3.63191 9.56641C3.39721 9.93275 3.22385 10.3349 3.11866 10.7571C3 11.2334 3 11.7418 3 12.7587V14.6C3 16.8402 3 17.9603 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.98717 20.9732 7.0233 20.9983 9 20.9999M15 20.9999C13 21.0014 11 21.0014 9 20.9999"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   issues: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M4.29927 8.58144C3.56321 8.23337 3.19518 8.05933 3.07708 7.82383C2.97431 7.61888 2.97431 7.38112 3.07708 7.17617C3.19518 6.94067 3.56321 6.76663 4.29927 6.41856L10.5707 3.45291C11.0948 3.20508 11.3568 3.08117 11.6317 3.0324C11.8751 2.9892 12.1249 2.9892 12.3683 3.0324C12.6432 3.08117 12.9052 3.20508 13.4293 3.45291L19.7007 6.41856C20.4368 6.76663 20.8048 6.94067 20.9229 7.17617C21.0257 7.38112 21.0257 7.61888 20.9229 7.82383C20.8048 8.05933 20.4368 8.23337 19.7007 8.58144L13.4293 11.5471C12.9052 11.7949 12.6432 11.9188 12.3683 11.9676C12.1249 12.0108 11.8751 12.0108 11.6317 11.9676C11.3568 11.9188 11.0948 11.7949 10.5707 11.5471L4.29927 8.58144Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M21 12C20.8809 12.2538 20.5097 12.4413 19.7673 12.8164L13.4417 16.012C12.9131 16.279 12.6488 16.4125 12.3715 16.4651C12.126 16.5116 11.874 16.5116 11.6285 16.4651C11.3513 16.4125 11.0869 16.279 10.5583 16.012L4.23275 12.8164C3.49033 12.4413 3.11912 12.2538 3 12M21 16.5C20.8809 16.7538 20.5097 16.9413 19.7673 17.3164L13.4417 20.512C12.9131 20.779 12.6488 20.9125 12.3715 20.9651C12.126 21.0116 11.874 21.0116 11.6285 20.9651C11.3512 20.9125 11.0869 20.779 10.5583 20.512L4.23275 17.3164C3.49033 16.9413 3.11912 16.7538 3 16.5M13.4293 11.5471L19.7007 8.58144C20.4368 8.23337 20.8048 8.05933 20.9229 7.82383C21.0257 7.61888 21.0257 7.38112 20.9229 7.17617C20.8048 6.94067 20.4368 6.76663 19.7007 6.41856L13.4293 3.45291C12.9052 3.20508 12.6432 3.08117 12.3683 3.0324C12.1249 2.9892 11.8751 2.9892 11.6317 3.0324C11.3568 3.08117 11.0948 3.20508 10.5707 3.45291L4.29927 6.41856C3.56321 6.76663 3.19518 6.94067 3.07708 7.17617C2.97431 7.38112 2.97431 7.61888 3.07708 7.82383C3.19518 8.05933 3.56321 8.23337 4.29927 8.58144L10.5707 11.5471C11.0948 11.7949 11.3568 11.9188 11.6317 11.9676C11.8751 12.0108 12.1249 12.0108 12.3683 11.9676C12.6432 11.9188 12.9052 11.7949 13.4293 11.5471Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   settings: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M14.1026 4.417L13.7992 4.11982L13.7992 4.11981C13.1682 3.50174 12.8527 3.1927 12.4903 3.07661C12.1714 2.97446 11.8286 2.97446 11.5097 3.07661C11.1473 3.1927 10.8318 3.50174 10.2008 4.11981L10.2008 4.11982L9.89735 4.417L9.89735 4.41701C9.62451 4.68424 9.48809 4.81786 9.32984 4.91393C9.18951 4.99913 9.03695 5.06232 8.87749 5.1013C8.69764 5.14527 8.5067 5.14725 8.12481 5.15122H8.12481L7.70012 5.15562C6.81685 5.16479 6.37522 5.16937 6.03688 5.34354C5.73918 5.49678 5.49678 5.73918 5.34354 6.03688C5.16937 6.37522 5.16479 6.81685 5.15562 7.70012L5.15122 8.12481V8.12481C5.14725 8.5067 5.14527 8.69764 5.1013 8.87749C5.06232 9.03695 4.99913 9.18951 4.91393 9.32984C4.81786 9.48809 4.68424 9.62451 4.41701 9.89735L4.417 9.89735L4.11982 10.2008L4.11981 10.2008C3.50173 10.8318 3.1927 11.1473 3.07661 11.5097C2.97446 11.8286 2.97446 12.1714 3.07661 12.4903C3.1927 12.8527 3.50174 13.1682 4.11981 13.7992L4.11982 13.7992L4.417 14.1026C4.68424 14.3755 4.81786 14.5119 4.91393 14.6702C4.99913 14.8105 5.06232 14.963 5.1013 15.1225C5.14527 15.3024 5.14725 15.4933 5.15122 15.8752L5.15562 16.2999C5.16479 17.1831 5.16937 17.6248 5.34354 17.9631C5.49678 18.2608 5.73918 18.5032 6.03688 18.6565C6.37522 18.8306 6.81685 18.8352 7.70012 18.8444L8.12481 18.8488C8.5067 18.8527 8.69764 18.8547 8.87749 18.8987C9.03695 18.9377 9.18951 19.0009 9.32984 19.0861C9.48809 19.1821 9.62451 19.3158 9.89735 19.583L10.2008 19.8802L10.2008 19.8802C10.8318 20.4983 11.1473 20.8073 11.5097 20.9234C11.8286 21.0255 12.1714 21.0255 12.4903 20.9234C12.8527 20.8073 13.1682 20.4983 13.7992 19.8802L13.7992 19.8802L14.1026 19.583C14.3755 19.3158 14.5119 19.1821 14.6702 19.0861C14.8105 19.0009 14.963 18.9377 15.1225 18.8987C15.3024 18.8547 15.4933 18.8527 15.8752 18.8488L16.2999 18.8444C17.1831 18.8352 17.6248 18.8306 17.9631 18.6565C18.2608 18.5032 18.5032 18.2608 18.6565 17.9631C18.8306 17.6248 18.8352 17.1831 18.8444 16.2999L18.8488 15.8752C18.8527 15.4933 18.8547 15.3024 18.8987 15.1225C18.9377 14.963 19.0009 14.8105 19.0861 14.6702C19.1821 14.5119 19.3158 14.3755 19.583 14.1026L19.8802 13.7992L19.8802 13.7992C20.4983 13.1682 20.8073 12.8527 20.9234 12.4903C21.0255 12.1714 21.0255 11.8286 20.9234 11.5097C20.8073 11.1473 20.4983 10.8318 19.8802 10.2008L19.8802 10.2008L19.583 9.89735C19.3158 9.62451 19.1821 9.48809 19.0861 9.32984C19.0009 9.18951 18.9377 9.03695 18.8987 8.87749C18.8547 8.69764 18.8527 8.5067 18.8488 8.12481L18.8444 7.70012C18.8352 6.81685 18.8306 6.37522 18.6565 6.03688C18.5032 5.73918 18.2608 5.49678 17.9631 5.34354C17.6248 5.16937 17.1831 5.16479 16.2999 5.15562L15.8752 5.15122C15.4933 5.14725 15.3024 5.14527 15.1225 5.1013C14.963 5.06232 14.8105 4.99913 14.6702 4.91393C14.5119 4.81786 14.3755 4.68424 14.1026 4.417Z"
            fill="currentColor"
            className="opacity-0 transition-opacity group-aria-[current=page]:opacity-15"
         />
         <path
            d="M10.2007 4.11982C10.8318 3.50174 11.1473 3.1927 11.5097 3.07661C11.8285 2.97446 12.1713 2.97446 12.4902 3.07661C12.8526 3.1927 13.1681 3.50174 13.7992 4.11982L14.1026 4.417C14.3754 4.68424 14.5118 4.81786 14.6701 4.91393C14.8104 4.99913 14.963 5.06232 15.1225 5.1013C15.3023 5.14527 15.4932 5.14725 15.8751 5.15122L16.2998 5.15562C17.1831 5.16479 17.6247 5.16937 17.9631 5.34354C18.2608 5.49678 18.5032 5.73918 18.6564 6.03688C18.8306 6.37522 18.8351 6.81685 18.8443 7.70012L18.8487 8.12481C18.8527 8.5067 18.8547 8.69764 18.8986 8.87749C18.9376 9.03695 19.0008 9.18951 19.086 9.32984C19.1821 9.48809 19.3157 9.62451 19.5829 9.89735L19.8801 10.2008C20.4982 10.8318 20.8072 11.1473 20.9233 11.5097C21.0255 11.8286 21.0255 12.1714 20.9233 12.4903C20.8072 12.8527 20.4982 13.1682 19.8801 13.7992L19.5829 14.1026C19.3157 14.3755 19.1821 14.5119 19.086 14.6702C19.0008 14.8105 18.9376 14.963 18.8986 15.1225C18.8547 15.3024 18.8527 15.4933 18.8487 15.8752L18.8443 16.2999C18.8351 17.1831 18.8306 17.6248 18.6564 17.9631C18.5032 18.2608 18.2608 18.5032 17.9631 18.6565C17.6247 18.8306 17.1831 18.8352 16.2998 18.8444L15.8751 18.8488C15.4932 18.8527 15.3023 18.8547 15.1225 18.8987C14.963 18.9377 14.8104 19.0009 14.6701 19.0861C14.5118 19.1821 14.3754 19.3158 14.1026 19.583L13.7992 19.8802C13.1681 20.4983 12.8526 20.8073 12.4902 20.9234C12.1713 21.0255 11.8285 21.0255 11.5097 20.9234C11.1473 20.8073 10.8318 20.4983 10.2007 19.8802L9.89729 19.583C9.62445 19.3158 9.48803 19.1821 9.32978 19.0861C9.18945 19.0009 9.03689 18.9377 8.87742 18.8987C8.69758 18.8547 8.50664 18.8527 8.12475 18.8488L7.70006 18.8444C6.81679 18.8352 6.37516 18.8306 6.03682 18.6565C5.73912 18.5032 5.49672 18.2608 5.34348 17.9631C5.16931 17.6248 5.16473 17.1831 5.15556 16.2999L5.15115 15.8752C5.14719 15.4933 5.14521 15.3024 5.10124 15.1225C5.06226 14.963 4.99907 14.8105 4.91387 14.6702C4.81779 14.5119 4.68418 14.3755 4.41694 14.1026L4.11976 13.7992C3.50168 13.1682 3.19264 12.8527 3.07655 12.4903C2.9744 12.1714 2.9744 11.8286 3.07655 11.5097C3.19264 11.1473 3.50168 10.8318 4.11976 10.2008L4.41694 9.89735C4.68418 9.62451 4.81779 9.48809 4.91387 9.32984C4.99907 9.18951 5.06226 9.03695 5.10124 8.87749C5.14521 8.69764 5.14719 8.5067 5.15115 8.12481L5.15556 7.70012C5.16473 6.81685 5.16931 6.37522 5.34348 6.03688C5.49672 5.73918 5.73912 5.49678 6.03682 5.34354C6.37516 5.16937 6.81679 5.16479 7.70006 5.15562L8.12475 5.15122C8.50664 5.14725 8.69758 5.14527 8.87742 5.1013C9.03689 5.06232 9.18945 4.99913 9.32978 4.91393C9.48803 4.81786 9.62445 4.68424 9.89729 4.417L10.2007 4.11982Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M10.991 12C10.991 11.4477 11.4479 11 12.0001 11C12.5524 11 13.0093 11.4477 13.0093 12C13.0093 12.5523 12.5524 13 12.0001 13C11.4479 13 10.991 12.5523 10.991 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   copy: (props: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            opacity="0.15"
            d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819C7.76066 7 8.6272 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.3728 17 16.2393 16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
            fill="currentColor"
         />
         <path
            d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   trash: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M16 6L14.8944 3.78885C14.3463 2.69253 13.2257 2 12 2C10.7743 2 9.65374 2.69253 9.10557 3.78885L8 6M4 6H20M6 6H18V15C18 16.8638 18 17.7957 17.6955 18.5307C17.2895 19.5108 16.5108 20.2895 15.5307 20.6955C14.7956 21 13.8638 21 12 21C10.1362 21 9.20435 21 8.46927 20.6955C7.48915 20.2895 6.71046 19.5108 6.30448 18.5307C6 17.7957 6 16.8638 6 15V6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   github: (props: IconProps) => (
      <svg
         viewBox="0 0 256 250"
         width="256"
         height="250"
         fill="currentColor"
         xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid"
         {...props}
      >
         <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
      </svg>
   ),
}
