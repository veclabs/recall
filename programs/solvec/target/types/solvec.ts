/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solvec.json`.
 */
export type Solvec = {
  "address": "8xjQ2XrdhR4JkGAdTEB7i34DBkbrLRkcgchKjN1Vn5nP",
  "metadata": {
    "name": "solvec",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "VecLabs on-chain program - Merkle roots + access control for AI agent memory"
  },
  "instructions": [
    {
      "name": "createCollection",
      "docs": [
        "Create a new vector collection.",
        "Called once per collection. Sets up the on-chain account."
      ],
      "discriminator": [
        156,
        251,
        92,
        54,
        233,
        2,
        16,
        82
      ],
      "accounts": [
        {
          "name": "collection",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "dimensions",
          "type": "u32"
        },
        {
          "name": "metric",
          "type": "u8"
        }
      ]
    },
    {
      "name": "freezeCollection",
      "docs": [
        "Freeze a collection - prevents further writes.",
        "Used for archiving or compliance scenarios."
      ],
      "discriminator": [
        14,
        221,
        61,
        164,
        29,
        69,
        238,
        42
      ],
      "accounts": [
        {
          "name": "collection",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "collection.owner",
                "account": "collection"
              },
              {
                "kind": "account",
                "path": "collection.name",
                "account": "collection"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "getCollectionInfo",
      "docs": [
        "Get collection info (view function - no state change)."
      ],
      "discriminator": [
        51,
        211,
        196,
        175,
        100,
        74,
        59,
        250
      ],
      "accounts": [
        {
          "name": "collection"
        }
      ],
      "args": []
    },
    {
      "name": "grantAccess",
      "docs": [
        "Grant read or read+write access to another wallet."
      ],
      "discriminator": [
        66,
        88,
        87,
        113,
        39,
        22,
        27,
        165
      ],
      "accounts": [
        {
          "name": "collection",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "collection.owner",
                "account": "collection"
              },
              {
                "kind": "account",
                "path": "collection.name",
                "account": "collection"
              }
            ]
          }
        },
        {
          "name": "accessRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  115,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "collection"
              },
              {
                "kind": "arg",
                "path": "grantee"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "grantee",
          "type": "pubkey"
        },
        {
          "name": "accessLevel",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokeAccess",
      "docs": [
        "Revoke access from a previously granted wallet."
      ],
      "discriminator": [
        106,
        128,
        38,
        169,
        103,
        238,
        102,
        147
      ],
      "accounts": [
        {
          "name": "collection",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "collection.owner",
                "account": "collection"
              },
              {
                "kind": "account",
                "path": "collection.name",
                "account": "collection"
              }
            ]
          }
        },
        {
          "name": "accessRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  115,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "collection"
              },
              {
                "kind": "arg",
                "path": "grantee"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "grantee",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateMerkleRoot",
      "docs": [
        "Update the Merkle root after vectors are upserted or deleted.",
        "Called by the SDK after every write operation."
      ],
      "discriminator": [
        195,
        173,
        38,
        60,
        242,
        203,
        158,
        93
      ],
      "accounts": [
        {
          "name": "collection",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "collection.owner",
                "account": "collection"
              },
              {
                "kind": "account",
                "path": "collection.name",
                "account": "collection"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "newVectorCount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "accessRecord",
      "discriminator": [
        224,
        96,
        239,
        97,
        225,
        133,
        153,
        188
      ]
    },
    {
      "name": "collection",
      "discriminator": [
        48,
        160,
        232,
        205,
        191,
        207,
        26,
        141
      ]
    }
  ],
  "events": [
    {
      "name": "accessGranted",
      "discriminator": [
        21,
        212,
        83,
        192,
        198,
        26,
        62,
        185
      ]
    },
    {
      "name": "accessRevoked",
      "discriminator": [
        200,
        160,
        73,
        43,
        201,
        165,
        43,
        159
      ]
    },
    {
      "name": "collectionCreated",
      "discriminator": [
        69,
        167,
        76,
        142,
        182,
        183,
        233,
        139
      ]
    },
    {
      "name": "merkleRootUpdated",
      "discriminator": [
        115,
        162,
        36,
        72,
        29,
        55,
        39,
        134
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "nameEmpty",
      "msg": "Collection name cannot be empty"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "Collection name too long - maximum 64 characters"
    },
    {
      "code": 6003,
      "name": "invalidDimensions",
      "msg": "Invalid dimensions - must be between 1 and 4096"
    },
    {
      "code": 6004,
      "name": "invalidMetric",
      "msg": "Invalid metric - must be 0 (cosine), 1 (euclidean), or 2 (dot product)"
    },
    {
      "code": 6005,
      "name": "invalidAccessLevel",
      "msg": "Invalid access level - must be 0 (read) or 1 (read+write)"
    },
    {
      "code": 6006,
      "name": "cannotGrantToSelf",
      "msg": "Cannot grant access to yourself"
    },
    {
      "code": 6007,
      "name": "collectionFrozen",
      "msg": "Collection is frozen - no further writes are permitted"
    }
  ],
  "types": [
    {
      "name": "accessGranted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "grantee",
            "type": "pubkey"
          },
          {
            "name": "accessLevel",
            "type": "u8"
          },
          {
            "name": "grantedBy",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "accessRecord",
      "docs": [
        "Access control record - one per (collection, grantee) pair."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "grantee",
            "type": "pubkey"
          },
          {
            "name": "accessLevel",
            "type": "u8"
          },
          {
            "name": "grantedAt",
            "type": "i64"
          },
          {
            "name": "grantedBy",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "accessRevoked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "grantee",
            "type": "pubkey"
          },
          {
            "name": "revokedBy",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "collection",
      "docs": [
        "The main on-chain Collection account.",
        "Space: 8 (discriminator) + 32 (owner) + 4+64 (name) + 4 (dim) +",
        "1 (metric) + 8 (vector_count) + 32 (merkle_root) +",
        "8 (created_at) + 8 (last_updated) + 1 (is_frozen) + 1 (bump)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "dimensions",
            "type": "u32"
          },
          {
            "name": "metric",
            "type": "u8"
          },
          {
            "name": "vectorCount",
            "type": "u64"
          },
          {
            "name": "merkleRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          },
          {
            "name": "isFrozen",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "collectionCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "dimensions",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "merkleRootUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "oldRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "newRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "vectorCount",
            "type": "u64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
