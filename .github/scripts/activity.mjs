// Renders the profile's activity card (dark and light) from the GitHub
// contribution calendar, in the portfolio's toolkit (DDR-0001): mint on
// near-black for dark, the print palette for light, Archivo for numbers and
// captions, IBM Plex Mono for labels. Runs in GitHub Actions with the
// workflow's token; `--mock` renders generated data for a local preview.
//
//   node .github/scripts/activity.mjs <out-dir> [--mock]
//
// The calendar includes private contributions because the profile shares
// their counts. No dependencies: Node 20+ (global fetch).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LOGIN = "devjayzee";
const OUT = process.argv[2] ?? "out";
const MOCK = process.argv.includes("--mock");

// Archivo (800 at 75% width; 400 at 100%) and IBM Plex Mono (400, 600) subsets,
// SIL Open Font License 1.1.
const FONT_DISPLAY = "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";
const FONT_BODY = "d09GMgABAAAAABrIABAAAAAAPtwAABpqAAIAQgAAAAAAAAAAAAAAAAAAAAAAAAAAGhwboQYcTgZgP1NUQVReAIFYEQgKyxC6ewE2AiQDg0QLgWQABCAFhGAHIAwHG800sxERbBwAoGjTRVGqJ3PFf33AjSHYB9YdPFhRmxFtteqwjnY9B3QV1IIV63jfyId3onP1Xj6IIbCr37uZIibO2vHn9HIM459M0Yv3PySpZCGgOvuv7plomE1mN5pIDzD/ScDp+0qfAPTw/DZ7FugwpygGrQgIH8EhtESLCAhIiqLYuYi4WofrChfHE/1hvt0rSQc+g5Qq0Bo28CAfRiwTzIQa2D8am8REaMRChSrVs7kPl0PsJvZjfiSn9+tfs1XAJKz0NgdQjYAqgH8/mvucSXI0L1tA4yo0C7cQ+MR351ve2F17hKpAktCIDl0TWP/BK3LdFyTT7f/mqmz9ZHoAu484hyQUs0d2Nb82M6lUYxbTmSWo5V7iTk8vEMljCdRZQHAHLAGFZ0VKrZtzc9IBPX/Cunv+/E3Sxxwkbf+ytySIPI4gEvLX9sfIfTwctU0OcRz9MZfhtJbtplAP1hB09jYigAUAJEnoSVjJL4AAhopu5M6e3gIiH89a60EkHfDS0fvDVXM9CAXSoXRSk4xcEF0MH4+4eQ7aoNtUV7rerR72gte84T1f+NLf0YUjxggQJwSZLFGepJSimo46G2g6C69iJcoEmzzAdBiLh5glQ4xGiTMrxlxgydcEpq1gqeBigfdugeljTG8doAk0m8eEaE9xZkGaA2kpo81ZkEQzRzMwS5CcNYg5QgrG+NYNQqbG2ECLz4OUhD5KvMAVWh5tygWPHCRqZRdgCLCAk4QeDR+nEKcyz1BAAzpANvvY7xRxygAIAsIQARMssMGBKMS01J6GuLTW5hfH7qBumhp4PNW3lNp0Ev6LF/IaVYtajVJLEWhMnW0g6bBuxYwUf+5ZdgW1G6wILU2f9Rk0GGkx7aRbBj2nH+KQv9J5nwd9AynCLlBcXTHIea6qmSUnAOQ0LnHwlnq2G4EJaQTjNoojiAU9sXZSuB7cFK6DikFv3jHI3tc7KRZS6OiXAkwGpvzYYdpHhxkFGSAIA9v466DkecO5W620Y+2lIY1m6gpQ7Bub7oEtw24wmmdMZfUlVU5/aJLjFoZPGDvQmi4RF3HoPK0GJ61SPAnwiX4Br+m/xJjHSHHp8hJQSxUU+gsOy1ScZHtPx4FvlZfLTRm5yK2vG2d9wWKpVJuowUGrpO8SNRsavDg7ph6crc1noAtFDLY7R1XqRT8yjl68LEPkNvIY3OCkcQERXrSH9Ds/k9XGnfQ8t0otBijzHmk+iQGzxFiSAGz4mQmvOOFbGXv7GgIHmoXInrQIL4HkRK26E9ZBpkg9qleolOUtDgKuRjl8rTcMemi+WpWos/4iXS4MbwEQuSZY/CzR9TWlbsNDBucXJ8bpP4XZU6SqcD9wVH/PtO8/Se4uAEPF82MVAmg1pnugawbHW7IIIWCy1KfTlRbh87XKK2pTU5PSTntpHXXm62qwvCmMIPN5MCxTikUQlgvkChM0US0AICYOQIgQPK3aBBgMCaYkaTqdLcjn97W8grIMCqqJL7e6hpyqioy0kqKULF2Y5UDo1gdxdEc8CD6pyhwvJBeYRMRICdx2uiBxtUN8K0TrIhwOW7CA1yfAYqmoqqnLKSs5umkFUW4/IQZMvYVBTpRJPiCe/k8RVB6jrY70DYS1IIPc0F4GAz1KTBWAXJYPLmyeWXzq5m98yyPQ/INMPjVowX6FRVbbNKign+RaIAByWz4ICjSCEKYBjwY6kK+XrZUBAnbfVLYGgLh7KqkNSCMFxZQIIJNgBYBGkAmIKyCXQCPJZAAQACSOECK9UbqXQFqUxtBZX0M4+XUbbJuvFl4hVciqf1DQRT9DuZTrUUBc9WUQar+AXd/CTMX5bH2tWcspAdKgFxgCMA1/qFcw8DHzq1WvlJWNSblcLjoF9PJUqVApXx0HC6caRRol82Xl5M3WwK5aADEUFwhbAeALcCvMf7jvACAKIEAKaxqEG59MWSVCB4Q0wcV6IcKNpqmRFffjs2XlmmG9T9aHA0JsqpU9FbY9wyiZjmW0t3TPCjZS0TbbaG1zjaGrXrSdYxjdnLZ4tUSzxiWh40Cyl2undRhRR6NO6WhsRHkNveHVqWjDyRlezOnQ26+Xoy2+ZUk3YVy39Y9cvZMV83ESos1mOKwXxSbBjPrwTV0PhfyQHnXjXpy73V8PvIFYUtlAWe3sONW3XBnWMReba6fsjqBQ1Mpe9lI9O68I0+BBqB0+b3+XnKIDFT+kKQJUGPHyno13aNQPKAML45qoNEbHNIAUkM8nx4izBF7Hw3247RnJaPCykYi9CZYuUk7qFzWyVDzpB1QEBlYRgcFj0AsLq0TsO3wPJCpFJmmeGFZmLJIM8q/5tiRF4heea4rRWCpNpvo9r3JflldgV1XW1RgZGqwNkC1JVV2sMhqa7MM04PY63ubFFWhIoqqXyU5SKZ4AO8uAOWfsJDXLfKDD4GnnbUnSXMN/j7Fptyy6zwxsmQG0WiulyrNP8fxzYN+KJfAUnW2Vxnjw/q+LzQNkRRwKdC/GSEb4eowJ+Jkf3xg1nQlfJMmOg94aDNLWjtFBuU0Sqao1g5TUGGKhFxfRm9KSakdRVMqeJCsvcFrBwKEYSyWFSicoUWOUgNdzvkgzRSbsA29GUrm4JEDD8QGQ7JCUfL8SbyNoq6JheKqVV9fUTrxYNxEOIAQ+/j0PaJBqWUKCtwtvEMRjMCKh4GgaPMyUiKeSEQjB6wxMX0zOhrHU9twmOzMFTDe08g5zMMvKZN7jlJ/H44Iv/+vqcARiqQPVFBsGxuwMuw7XNabC4F0uoxhtfQXR4AGBJDHh7CDNZ8qQkOYx9Wflgjq+N3XoM9P46zyt+gsd+B4Ri4slQekQ+TYPs9V4G+TpxH70WcEj2HkiaZPcfeVqr0mXQa0lZP+OeRgcQ6UdQ9KO+8y0tYWDLrOnNIUM1pAjmIoC1ySJvmXoWc2pC4gN5RcPcxsh8nFefzTsLVQhF2idm2c1nzhneXV1FVTrAXTI4sZluQjb5D9M/0v/bky82AK40jnj7eJBVmGLgOOZG3djxsQnDec0FeUBugy/Ak+US8SuUXUjAt/7Jz6h3w4+C6W2w7CObNZ0YNDyfgQ3s3TbobCayLefaDuLL0xoLCf/fv7a6LB8rwuiJfXr8gosN1ab1BpWXM0ODE1ta2HdspB0YkWb0PBVMVqbdsWVDGVpxRGw+ZCnOSsaKfq7GTBggKB+MEFYG48jp6PxaTahDzMQXPQenYs2gyRzzJcs9QnB+F5y+uZqQn1IWc1VYEWzztwauLOB+Q22shOS5rSDe5dWDM75fzl0F2fAKUc+AuUKkOwcxsXeahDaYkwoe6go1y/Honc5nl7i9BHbOvzvkioDG6jBIgG3mIv+Mb8rrw2UjGNsfk3J2tP+PXCgAYfBDyW6kfm5v9nu3jWVgEk0iwPzKWOPwz7MRZUCzSW5e0ljsnbpQ3bEGxlk+GWoJMJIMd/hZqjFGJy0dhUK/Y9ytLQW4/kaVG5VbeaAJyq4CJkVIvY492GYSvwBaJtZ/1pPp+86e89YaHdHm9vWPHDCaAqgC0hyxfG63zs9wcO+PIZxxNnFb7oq0vPdh4Na8i+ljAV47/82Em6CL8qxvddbWv57kUJ1U61VS0qxf2wwYv8Tu3H3uwHIR7akFE7249q45nVOu0EOw1OjlQRf1KyAJAN1l4GPBN6OQcyKmC8TqM7XaYknA0TRGMEd0RCH1LmQm9xxSzU1fqv1EzQrWLbV95KImAw9gitvAtWsqCfW0PFwwH1qGPCQivuOdxdBjKeCSnpPIN7ko+EciOcvzFWjlKrAOmbVFcleiGXINf54FsYjv57lu4Nzl/y2Qr5HF1KJfzFotZrNww75y+6UjWkPUwQrhgJQ2LQLdOCxR12HbOrKRl/lQpEkfLJ2O9ufNY+AFijjmUBG7CRsolXo9SV2xd6E/f41mSP69u99CZpizF9tlNKv2hafMrjTOyiqt0K20iBdWdwXZb5K3nf1uhFWGhttBLa1PoGVDGmz0pOlyX3BnJkEBUvOMXnSRIGmwKzPYtJGO6XP9IGQtB+bPT3zO+hGVE3T6+d0bepdN9s+hqtvLiwWsvJcJLGmgsNudSNd7OZytlbiTmMZhB6HoWkMB9jWgtp/1cZ/OtuN//6rqV1gms9zpPzEFcniFGS8asT48yc9os0bLo8yj3q8zXx7Hz41j7ldZipjgPGIZWt6t7Tnz51taFQ1oc1CmiunhPZneV40TehB/48fKpEebkvNAH1eKTWzUB7+0WSu0oTZFmkz7LHAttZLaiMVry1mt7GbbVoLfkPpo7FsMoyXmP1dKJLk5Z3xHjdl1fgGfCyjxl3dHhwTMbvpbuGEEZfltstasMk4Y/Zu08mldDj0zw5Jw5jeXcJ0bIAmJSKUdvdhwYL95srTePqcBR4CJECSNN21Z9z6Q8pvXzXB0diow561hcZT1csnhERjo0+DcYia//LMczs6zXOUWSM5Zk5nh3luxmoT14kWS/A+BVJ5p3faysTlOdA5EpxPiVSAguKnAdjWFqg9AyCPOCeruIgt+wR3vOHKlCLKtiLKG8Ad1t15YGqEkpd6eOliB3H65Ixj51+nKpWbRXcK1Dn+tin4ylHRITG+AJ5EKSJtcpMDgAnBLUfmZ0J5vJCwkOKg8BDyN0tSNkoZWVmWTKj9ZYy3Io0pfQ1QBkGugPwoWbY7XgWlq7PCi6II8zWJkDA/vjoZW9VnQlrijSkSapqEoVU7B1HAn/pVAafgjQvUIAoHcWSd3lXezc5ih91R6nBuLsJelncO5oB+Kp6ue+LZtEEPE2zY6O19UgZ6wam9veVdZ6ljZ+PgtPwGF7zpbE9ThgkdFw2pQXWfdc793/HN7Regzh4GLLpnHK3lAkCYFR+VbTv/hGz/0/BOgahsu4QLuYgDKHTE1LrzwpBzwsrwqWiAY86njjbHMhdQV5nBcQR6LvZ6RnaW0k0aEpkrRPNIDLpKHh9lDe4Hzxwg8eLEMnsaTclEx2Ii0vlXUPFJcXEkOKpMHhujxY3YPANLMzXFnKEmN60HYgS7gLoaHqpTXbLDYckf9hFELh6rw+Njdrt4Nj39ENasQMrQ5qvMlJiaOG12tDil4BUIN/Xl/AHdHs+ArkpBXrYhmY3KZTqg8W4a7Su+QImU4qzfIHrDBKqNhsrl5GPAN0jdPFa3z5PV4eKJiPseJMPg9ktquA6+2kpF61m3UgrE0dlIrSsmhXkVbZYhFVjzIRCPMFTzs7uKvNmdNXyTrpTLarRSuzE4ozSVRcAxksNsYWjVtILk42I0TaAEWOgDXrn2z9P12DqiLLB+KHAeNugMFmx8f3rkopHTc9iJlQkFfp3/MJi7hfTHQaaFoSfsTCIy1EiSgsqCcoszVLhOBwPPK8QsuRgyZgKRBek9GWpzclxCHCr5Kl+rF2ZQFXpy1h7ZngSzKY7QgTmJ24nFbxvcJbnGzLwmkTzLxO7rAspLdjicH7M/laXDU3OlNXYvPuzYuMQ0KYEkY7KBotFn9xU2RtojBesA+5SOmN7aLKIndCbo7QYM+wHOMg7f/VO56dQeqX8acDiXyffeJaCMVMMN8JyEjcQsLTkGxoi/RMxU48i6nAZ7Ce7FVi2SuJgoZ7Bbp/rxjzYu9ZC+9jHz1ZL+aVZZRNK8TCkIYy2f21Xk5XYqbjROxun0FnG6MuZrs+TpBIs0XkYoOGbKylKk4wtk8VK85bBmQLFmlypUB19dQGXLXDxmt8/N6kSvIsK+j0mwd+PesB+QIpXbT2e+TLGKozhxmpoYMHPNO1hS4D68yMXL6nT7WN1unjRtlwDXqXc9eIOOyUVqOFHifdZNVsIGlEgpO8YH3Abv3P2LGDXSbMITYD9e4NPAL2SbkI4daSFhgYVBsKDA9HskfGNgMn6RMtb5/QvjYTrxiFXfn8HSIROa0TBEoA0RpyDR0f9tvB6dlDysH0UTd05Fp/5ebugP9iEod1noEoVOFTVdNaNUV2pJRCVy+X9tOQyeIfSuvBLiFvfj2jgU6RNZAbHtfn3XgfMHI9xemA9FtYX4k8ilRTDHwQiwal6EKx9nWbAiCcZaNyFDjfVqsJlzVkfDcmbtlhjwlrkRTnkUa+OSLBhm0tZueRSIfD58E6gesiukOnvZpt97oqrGnQx5lUHTFhTJKKGhLg25cSrCXRnpI1GssJxtJ4+K7VGODX9eEjWbbgMsI/WvaN1kKO3vbB3AILiFOJERO7ayMlJFjcm5XJuU0pI4Wt4LVJMVsqGaX/B4P8K/dja6FdXyA8hze2+t5coMUbmEV2T/4lzAQlNxqmolmxdgljMNTOzBuXT2p1OplMLguEid1FlHlfBMGGuigsTA5fFlBtG9z3f3WevMAIsw1mVyHOIIR4TYIFGprEI585ImjqLR5ZK+ldPI+O2p5D4lJcLZn8e3ljPksjIKzySk/eLcDm7QFihEwsJaCLhW5OgoasW07JkxBUVH05rpNTQPSb7v5U3vwc1TIZrPpXOtAHiEpoYtKFM5GOlyBZGaISWkqjksvOQdBWNeeN0cntIzysyNuhK5YnCqwEvnePW53JoqDshACNx4SS5+aHE1frLY5iYJdE4OpUjkhObWUYQyMaoDmK+mKePTdV4+3Z+jFFRUcNVaZh9GlUFBy58zmVIKVkGjYJXfwTQPY7V+pmvE5gbzI47OUKlu5Q3CD5UwAAZhrWJnOjhcjnXr90wTi51p8bG02hIW08JmMU3fj2ZbuZxMRyXbotFq5QK+Vq7V6uR8gU6uUYqUYh5XKRKJlCIuTykG/RFaF4fiFTqhXg9FJBEndgDzkWyFlQTyqwTlFVKBx7FDq3BTchpzNEzJbZ4ZVIxCQmYy+zBK2gEygmQEx44TGnFjKysFVVE7jgcvlJLCulp+lBzG571IfLTElhfAm7v21jqFWdCtUFjQS3YpdkV2Ga6Z5B/z+O45az1Bq7WKPaBWWS7oUB1JEpCKI6V+ClcZ4hcV1pzXB579aDV05VXRUDFJUWrBeYicmEGFtMMIknvU/UzhyaeIvPJnxWTiRePmCrUK9YHorSOLpOLEBhIqGg6UUHDHzvVAq/OUxtvKq9S0crVs69HvTJW5fzGLpYaen5GlO0KrFKp8YivKNJO1rBWoNiCPJ+fQL5JbfmeyXmLD1mDk14GjylcFDNMpxEm7k6GqkiI+ThIBfEtGVsmSGdkO4iN4K5L10qpmc8L3qsrSbxa9Lu/Wc9Nb/At8g/ERZcMTKJB79bhIeATcERQdkXDli8uQlM1Ux8POnkNmJkonHpj6HwZyrt+8pq1QTVkNWKnvN7YqL6mV1ypIrDL0Gy8H3XSU2CZo4yV16cSSwCvKXpO+BD/Lqi+HLuUzmZFrZNh6L6Fj+GeMfHT0F3kvt99fk4kzADPiU7RaNAFpmWrBmoJvRxa382lPt/OZxcUbKJtGmmc0kuarxIGg+q7V7Rj7Hc+s+ROlhokpXpOJIGMe4ebrReSr8TOr46xx1TOR18mLXt8kcGPGnQgLvRnzLy+MtBICoe+HnuzqD7LuEk/+2nMZ5KxH+XWSyO3fdTN01WEnumKBe8HQ3dK6P3VScPLuu0f6A8dvB3il/qyuyfP1HCl/Ige6Xgpx0ppkqNLn4eMkmOFBQoVO8J0D0UbygEmrA9MPDy8NHx5MTm2nipOmzPICypkRQ2d4ZkQPLVezFc2IGSpfFnieGcwKRrdmm5D2nWnBV1cSAuSTNwUmERYq4/I/4/a36GP3b0GH5MrTD5254XoMCQOkSlmr2BvH9Mdu5t48qj96A+RK9Tf01y/WSwPWYMvUJVOXWm6c8IKk4EiPhqVJO2sPhFdt64b+S0TjUVI0tuPA2cJ500anpjATSGtL2/eD6rSFY2yLxpgGcXo4YM/bXuO73gQjQ4Ej5ilVC7rZWUamFJeap1KmGqTYPvptTr+0TQgM7Re3H+fXz38ZcjXIAzIc0U80yA6BTnPDGv3E0l7Tfx+5r8Gt/4bvtVVsm9qpXTqkfBnk8c6ntjukk/2K5FKGYtXFFMoRZhQMFn0+Lcm9ezGJ9dZKaIlUZCeRLtMoj/GxkYbgMBitz4bmC424yVBfQgEqVZZBK3c0eieskDZ2bTQXLx+6Yd3GHUmqUGk4V1whQyhgmLcY1rAGDElXGV1JSvQOAVkIfSskLRQpleac4CNClUgkLmii6nWN9BwLL8aOCF2iQWXi5pyag6O0ShJJYq2QrI09zKQvNyQO4GqTedSDvTprm4zvamEA69bx2vFgpyGvbmhgKeDzjjf3o6cAgCJr6hmW4Y0SfgkNCnoOAB+/UzYAwHfQ/CP/v6itmsmX/QwESQACv4pHtR9NLvAuefLa2pvN6r1CfVZp7+neT/gdgqzwmPj06WdmxTRlZ8q9ElqSWZPJ8NkJHt17DXl3r/YWPbpIbD80o2cYk+tZvZvZy4zuh2uRUnszsiGqqqLeyhRLcnnFHYi1OyM9MNK9ca4UmkwWUFaj7ZcQgOZtygTK/K+cJi3txpD8ye6bzAocwTM/y3cgXRthmIt3o1O2a3v89sfqKZvUO4jOsn370EnAIugKTSiHOojQDTrLZlqZS9rkNFi+tHlpYUaHEWSitlzl7nwUVGpAgQsajZWl6NqANFjIXYdDzq/dsBFfZL8Zwf5BfjhNduF63cRh826lJ7CBFEQ7XjN50oLJd7r3cV39ZpZdQICtKoRAcueVOR6kEdMIcDeEE4SCu0+QHK+doOnlncF15QkB6VgnBBVSO97RI6O6EmBlH50gMHJqsMAhMZGA7wqehu/6lWUwcrfhGjTq0vw/hc5b4XTTZWEXzLDBL4dqVsqySruGK0yhm86r+ZVqVQXatGoNmrWIBo4W3mj1ztdZZ6tV6WQbHwh2g7oRnyx5/Zj7klcLuhm6NPKTy7FDp7Qhp/Ors0Ama5UxZ7tCm/EdKNGMpZMuuuiqv8nyGGgJgC6YDjZ0wat4sno4VHp23bOene1KQ+WNiQoCwjq1oIhEhffuVfQK+YPnhRBlRRi0dp0Sn6PVuqHJLmUeYm5aLwjfnqpF0+nT+T/5sC4CAA==";
const FONT_MONO = "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";
const FONT_MONO_600 = "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";

const THEMES = {
  dark: {
    bg: "#0a0a0b", divider: "#212127", ink: "#f5f3ef", body: "#c9c6c0", label: "#a3a09a",
    muted: "#8f8c86", accent: "#3fe0ac", empty: "#17171b",
  },
  light: {
    bg: "#ffffff", divider: "#c9c7c2", ink: "#111110", body: "#33322f", label: "#4a4843",
    muted: "#55524d", accent: "#00694b", empty: "#ecebe8",
  },
};
const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];
const MIX = [0, 0.28, 0.5, 0.74, 1];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel weekday } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": LOGIN },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user.contributionsCollection.contributionCalendar;
}

function mockCalendar() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const end = new Date(Date.UTC(2026, 9, 25));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
  const weeks = [];
  let total = 0;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === 0) weeks.push({ contributionDays: [] });
    const busy = d.getUTCMonth() === 7 ? 3 : 1;
    const c = rnd() < 0.18 ? 0 : Math.floor(rnd() * 14 * busy);
    total += c;
    const lvl = c === 0 ? 0 : c < 4 ? 1 : c < 8 ? 2 : c < 13 ? 3 : 4;
    weeks.at(-1).contributionDays.push({
      date: d.toISOString().slice(0, 10), contributionCount: c, contributionLevel: LEVELS[lvl], weekday: d.getUTCDay(),
    });
  }
  return { totalContributions: total, weeks };
}

function streaks(days) {
  let longest = 0, run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Current streak: up to today, or to yesterday when today has nothing yet.
  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i -= 1;
  let current = 0;
  for (; i >= 0 && days[i].contributionCount > 0; i -= 1) current += 1;
  return { current, longest };
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) =>
  "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => n.toLocaleString("en-US");
const plural = (n, w) => `${fmt(n)} ${w}${n === 1 ? "" : "s"}`;
const niceDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function render(cal, themeName) {
  const th = THEMES[themeName];
  const W = 960, H = 306, PAD = 40;
  const cell = 11, pitch = 14.6, gx = 84, gy = 160;
  const days = cal.weeks.flatMap((w) => w.contributionDays);
  const s = streaks(days);
  const first = days[0]?.date, last = days.at(-1)?.date;
  const ramp = LEVELS.map((_, i) => (i === 0 ? th.empty : mix(th.empty, th.accent, MIX[i])));
  const label = `font-family="Plex,ui-monospace,monospace" font-size="11.5" letter-spacing="0.92"`;

  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">`);
  o.push(`<title id="t">GitHub activity for ${LOGIN}</title>`);
  o.push(`<desc id="d">${esc(plural(cal.totalContributions, "contribution"))} from ${esc(niceDate(first))} to ${esc(niceDate(last))}, private ones included. Current streak ${esc(plural(s.current, "day"))}; longest streak in the period ${esc(plural(s.longest, "day"))}.</desc>`);
  o.push(`<style>@font-face{font-family:ArchivoD;src:url(data:font/woff2;base64,${FONT_DISPLAY}) format("woff2");font-weight:800}`);
  o.push(`@font-face{font-family:ArchivoB;src:url(data:font/woff2;base64,${FONT_BODY}) format("woff2");font-weight:400}`);
  o.push(`@font-face{font-family:Plex;src:url(data:font/woff2;base64,${FONT_MONO}) format("woff2");font-weight:400}`);
  o.push(`@font-face{font-family:Plex;src:url(data:font/woff2;base64,${FONT_MONO_600}) format("woff2");font-weight:600}`);
  o.push(`.d{font-family:ArchivoD,"Arial Narrow",sans-serif;font-weight:800;font-variant-numeric:tabular-nums lining-nums}`);
  o.push(`.b{font-family:ArchivoB,Arial,sans-serif}</style>`);
  o.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="2" fill="${th.bg}" stroke="${th.divider}"/>`);

  // header row
  o.push(`<text x="${PAD}" y="40" ${label} fill="${th.label}">ACTIVITY · LAST 12 MONTHS</text>`);
  o.push(`<text x="${W - PAD}" y="40" ${label} text-anchor="end" fill="${th.muted}">INCLUDES PRIVATE CONTRIBUTIONS</text>`);
  o.push(`<line x1="${PAD}" y1="58.5" x2="${W - PAD}" y2="58.5" stroke="${th.divider}"/>`);

  // three numbers, as in the site's metrics band
  const stats = [
    [fmt(cal.totalContributions), "", "Contributions in the last year", th.ink],
    [fmt(s.current), s.current === 1 ? "DAY" : "DAYS", "Current streak", th.accent],
    [fmt(s.longest), s.longest === 1 ? "DAY" : "DAYS", "Longest streak in the period", th.ink],
  ];
  stats.forEach(([n, unit, cap, color], i) => {
    const x = PAD + i * 230;
    const u = unit ? `<tspan font-family="Plex,ui-monospace,monospace" font-weight="600" font-size="13" dx="5" fill="${th.label}">${unit}</tspan>` : "";
    o.push(`<text class="d" x="${x}" y="106" font-size="44" letter-spacing="-0.44" fill="${color}">${esc(n)}${u}</text>`);
    o.push(`<text class="b" x="${x}" y="128" font-size="13.5" fill="${th.body}">${esc(cap)}</text>`);
    if (i > 0) o.push(`<line x1="${x - 24.5}" y1="72" x2="${x - 24.5}" y2="134" stroke="${th.divider}"/>`);
  });

  // month labels where a new month starts (skipping cramped ones)
  const starts = [];
  cal.weeks.forEach((w, wi) => {
    const d = w.contributionDays[0];
    if (!d) return;
    const m = Number(d.date.slice(5, 7)) - 1;
    if (!starts.length || starts.at(-1).m !== m) starts.push({ wi, m });
  });
  starts
    .filter((st, i) => (starts[i + 1] ? starts[i + 1].wi - st.wi >= 3 : cal.weeks.length - st.wi >= 3))
    .forEach(({ wi, m }) =>
      o.push(`<text x="${(gx + wi * pitch).toFixed(1)}" y="${gy - 10}" ${label} fill="${th.muted}">${MONTHS[m].toUpperCase()}</text>`));
  [["MON", 1], ["WED", 3], ["FRI", 5]].forEach(([l, r]) =>
    o.push(`<text x="${PAD}" y="${(gy + r * pitch + 9).toFixed(1)}" ${label} fill="${th.muted}">${l}</text>`));

  // the grid
  cal.weeks.forEach((w, wi) => {
    for (const d of w.contributionDays) {
      const lvl = Math.max(0, LEVELS.indexOf(d.contributionLevel));
      o.push(`<rect x="${(gx + wi * pitch).toFixed(1)}" y="${(gy + d.weekday * pitch).toFixed(1)}" width="${cell}" height="${cell}" rx="1" fill="${ramp[lvl]}"><title>${esc(plural(d.contributionCount, "contribution"))} on ${esc(niceDate(d.date))}</title></rect>`);
    }
  });

  // footer: when it was drawn, and the legend
  const fy = gy + 7 * pitch + 24;
  o.push(`<text x="${PAD}" y="${fy.toFixed(1)}" ${label} fill="${th.muted}">UPDATED DAILY · ${esc(niceDate(last).toUpperCase())}</text>`);
  const lx = W - PAD - (5 * pitch + 92);
  o.push(`<text x="${lx.toFixed(1)}" y="${fy.toFixed(1)}" ${label} fill="${th.muted}">LESS</text>`);
  ramp.forEach((c, i) => o.push(`<rect x="${(lx + 42 + i * pitch).toFixed(1)}" y="${(fy - 10).toFixed(1)}" width="${cell}" height="${cell}" rx="1" fill="${c}"/>`));
  o.push(`<text x="${(lx + 42 + 5 * pitch + 6).toFixed(1)}" y="${fy.toFixed(1)}" ${label} fill="${th.muted}">MORE</text>`);
  o.push(`</svg>`);
  return o.join("");
}

const cal = MOCK ? mockCalendar() : await fetchCalendar();
mkdirSync(OUT, { recursive: true });
for (const name of Object.keys(THEMES)) {
  const svg = render(cal, name);
  writeFileSync(join(OUT, `activity-${name}.svg`), svg);
  console.log(`activity-${name}.svg`, `${(svg.length / 1024).toFixed(1)} KB`);
}
console.log("total", cal.totalContributions, "streaks", JSON.stringify(streaks(cal.weeks.flatMap((w) => w.contributionDays))));
