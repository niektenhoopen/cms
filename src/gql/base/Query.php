<?php
namespace craft\gql\base;

/**
 * Class BaseQuery
 */
abstract class Query
{
    // Traits
    // =========================================================================
    use GqlTypeTrait;

    // Methods
    // =========================================================================
    /**
     * Return the queries defined by the class as an array
     *
     * @param bool $checkToken Whether the token should be checked for allowed queries. Defaults to `true`.
     * @return array
     */
    abstract public static function getQueries($checkToken = true): array;
}